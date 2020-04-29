import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    grow: {
      flexGrow: 1
    },
    menu:{
      background: "#298A08"
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  }));