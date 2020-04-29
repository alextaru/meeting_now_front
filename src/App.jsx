import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { 
  AppBar,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Grid
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';



export default class App extends React.Component{

  calendarComponentRef = React.createRef()
  
  state = {
    open: false,
    selectedDateInit: new Date(),
    selectedDateAnd: new Date(),
    calendarWeekends: true,
    calendarEvents: [{}],
    responsavel: "",
    tema: ""
  }

  render() {
    return (
     <> 
        <div className='root'>
        <AppBar position="static">
            <Toolbar>
              <IconButton edge="start"  color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                Sala 1
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div className='demo-app'>
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
                  label="Data termino"
                  value={this.state.selectedDateAnd}
                  onChange={this.handleDateChangeEnd}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker_end"
                  label="Hora termino"
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
    );
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

  handleAgendar = () => {
    const titleTemp = this.state.tema + " - " + this.state.responsavel


    this.setState({ 
      open: false,
      calendarEvents: this.state.calendarEvents.concat({ // creates a new array
        title: titleTemp,
        start: this.state.selectedDateInit,
        end: this.state.selectedDateAnd
      })
    })
  }
  
  handleClose = () => {
    this.setState({ 
      open: false,
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
      selectedDateInit: arg.date,
      selectedDateAnd: arg.date
    })
    this.handleClickOpen()
    
      /* this.setState({  // add new event data
        calendarEvents: this.state.calendarEvents.concat({ // creates a new array
          title: 'New Event',
          start: arg.date,
          allDay: arg.allDay
        })
      }) */
    
  }

  
}
