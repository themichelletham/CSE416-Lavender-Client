import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Container';
import Banner from "../images/banner.png";
import PlatformIcon from "../images/platformicon.jpeg"
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';
import { createTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'

const useStyles = makeStyles((theme) => ({
  PlatformProfileContainer:{ 
    display: 'flex', 
    overflow: 'hidden', 
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center', 
    width: '100%'
  },
  banner: {
    width: '100%',
    height: theme.spacing(30),
    overflow: "hidden",
    position: 'absolute',
    float: 'left',
    //top: 0,
    left: 0, 
    //zIndex: 'modal',
  },
  icon: {
    float: 'left', 
    left: '5%', 
    top: '30%', 
    //marginLeft: theme.spacing(5), 
    //marginTop: theme.spacing(10),
    //marginBottom: theme.spacing(5), 
    height: theme.spacing(22),
    width: theme.spacing(22),
    //borderRadius: "100%",
    position: 'absolute',
    //zIndex: 'tooltip'
  }, 
  title:{
    paddingTop: '23%', 
    paddingLeft: '8%'  
  }
}));

export default function PlatformProfile(props) {
  const classes = useStyles();
  return ( 
    <Grid  className={classes.PlatformProfileContainer}>
      <Box sx={{ zIndex: 'modal', maxWidth: 'md' }} >
        <img className={classes.banner} src={Banner}/></Box>
      <Box sx={{ zIndex: 'tooltip' }}>
        <img className={classes.icon} src={props.platform_icon}/>
      <Box className={classes.title}>
        <Typography variant='h4' ml={2} mt={2}> {props.platform_name}</Typography>
      </Box>
    </Box>
    </Grid>
  )
}


