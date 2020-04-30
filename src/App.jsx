import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Agenda from "./components/Agenda";

export default class App extends React.Component{

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
                Meeting Now
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <Agenda/>
      </>
    );
  }

}
