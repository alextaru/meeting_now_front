import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Collapse,
  NativeSelect
} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from "moment";
import Alert from '@material-ui/lab/Alert';

import AgendaApi from "../services/AgendaApi";

export default class Agenda extends React.Component{

    calendarComponentRef = React.createRef()
  
    state = {
        open: false,
        selectedDateInit: new Date(),
        selectedDateAnd: new Date(),
        calendarWeekends: true,
        calendarEvents: [{}],
        responsavel: "",
        tema: "",
        sala: 1,
        alertOpen: false,
        menssagem: "erro"
    }

    async componentDidMount(){
        
        const response = await AgendaApi.get(`agenda/${this.state.sala}`);

        this.loadData(response)
    }

    render() {
        return (
            <>
                <div className='demo-app'>
                    
                    <NativeSelect
                      className='selecSala'
                      value={this.state.sala}
                      onChange={this.handleChangeSala}
                      inputProps={{
                        name: 'Sala',
                        id: 'age-native-helper',
                      }}
                    >
                      <option aria-label="None" value="" />
                      <option value={1}>Sala 1</option>
                      <option value={2}>Sala 2</option>
                      <option value={3}>Sala 2</option>
                    </NativeSelect>
                    <div className='demo-app-calendar'>
                    <FullCalendar
                        defaultView="timeGridWeek"
                        header={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                        ref={ this.calendarComponentRef }
                        weekends={ this.state.calendarWeekends }
                        events={ this.state.calendarEvents }
                        dateClick={ this.handleDateClick }
                        />
                    </div>
                </div>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <Collapse in={this.state.alertOpen}>
                        <Alert variant="filled" severity="error">
                        {this.state.menssagem}
                        </Alert>
                    </Collapse>
                    <DialogTitle id="form-dialog-title">Agendar Reunião</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        O agendamento nao poderá ser cancelado
                        </DialogContentText>
                        <TextField
                        autoFocus
                        margin="dense"
                        id="tema"
                        label="Tema da reuniao"
                        type="text"
                        value={this.state.tema}
                        onChange={this.handleChangeTema}
                        fullWidth
                        />
                        <TextField
                        margin="dense"
                        id="name"
                        label="Nome responsável"
                        type="text"
                        value={this.state.responsavel}
                        onChange={this.handleChangeNome}
                        fullWidth
                        />
                    
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-init"
                            label="Data inicial"
                            value={this.state.selectedDateInit}
                            onChange={this.handleDateChangeInit}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                            
                            <KeyboardTimePicker
                            margin="normal"
                            id="time-picker_init"
                            label="Hora inicial"
                            value={this.state.selectedDateInit}
                            onChange={this.handleDateChangeInit}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            />
                        </Grid>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-end"
                            label="Data término"
                            value={this.state.selectedDateAnd}
                            onChange={this.handleDateChangeEnd}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                            
                            <KeyboardTimePicker
                            margin="normal"
                            id="time-picker_end"
                            label="Hora término"
                            value={this.state.selectedDateAnd}
                            onChange={this.handleDateChangeEnd}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            />
                        </Grid>
                        </MuiPickersUtilsProvider>
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        Cancelar
                        </Button>
                        <Button onClick={this.handleAgendar} color="primary">
                        Agendar
                        </Button>
                    </DialogActions>
                    </Dialog>
            </>
        )
    }


  toggleWeekends = () => {
    this.setState({
      calendarWeekends: !this.state.calendarWeekends
    })
  }

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi()
    calendarApi.gotoDate('2000-01-01')
  }

  handleClickOpen = () => {
    this.setState({ 
      open: true
    })
  };

  handleAgendar = async () => {
    const validacaoData = moment(this.state.selectedDateInit).isBefore(this.state.selectedDateAnd);

    if(!validacaoData){
      this.setState({
        alertOpen: true,
        menssagem: "Data término não pode ser antes de data inicial - Favor escolher outra data"
      })
    }else if(!this.state.tema || !this.state.responsavel){
      this.setState({
        alertOpen: true,
        menssagem: "Todos os campos são obrigatórios - Favor preencher"
      })
    }else{
      const data = {
        "sala": this.state.sala,
        "tema": this.state.tema,
        "responsavel": this.state.responsavel,
        "dataInit": moment(this.state.selectedDateInit).format("YYYY-MM-DD HH:mm"),
        "dataEnd": moment(this.state.selectedDateAnd).format("YYYY-MM-DD HH:mm")
      }
      try {
        const response = await AgendaApi.post(`agenda`, data);
        this.loadData(response)
      } catch (error) {
        this.setState({
          alertOpen: true,
          menssagem: "Data inválida - Favor escolher outra data"
        })
      }
    }
  }
  
  handleClose = () => {
    this.setState({ 
      open: false,
      alertOpen: false
    })
  };

  handleDateChangeInit = (date) => {
    this.setState({ 
      selectedDateInit: date
    })
  };

  handleDateChangeEnd = (date) => {
    this.setState({ 
      selectedDateAnd: date
    })
  };

  handleChangeNome = (event) => {
    this.setState({ 
      responsavel: event.target.value
    })
  };

  handleChangeTema = (event) => {
      this.setState({ 
        tema: event.target.value
      })
  };

  handleDateClick = (arg) => {
    this.setState({ 
      selectedDateInit: arg.dateStr,
      selectedDateAnd: arg.dateStr,
      responsavel: "",
      tema: ""
    })
    this.handleClickOpen()
  }

  loadData(response){
    response = response.data.map(item => {
      const descricao = item.tema + " - " + item.responsavel

      const modelo = {
        title: descricao,
        start: new Date(item.dataInit),
        end: new Date(item.dataEnd)
      }
      
      return modelo
      
    })

    this.setState({ 
      open: false,
      calendarEvents: response,
      alertOpen: false
    });
  }

  handleChangeSala = async (event) => {
    let idSala = event.target.value;
    idSala = parseInt(idSala) 
    this.setState({ 
      sala:idSala
    });
    const response = await AgendaApi.get(`agenda/${idSala}`);

    this.loadData(response)
  };
}