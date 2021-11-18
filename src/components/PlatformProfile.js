import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Container';
import Banner from "../images/banner.png";
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

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
    top: 0,
    left: 0, 
    zIndex: 'modal',
  },
  icon: {
    left: 0, 
    float: 'left',
    marginLeft: '10%', 
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(5), 
    height: theme.spacing(22),
    width: theme.spacing(22),
    borderRadius: "100%",
    position: 'absolute',
    zIndex: 'tooltip'
  }, 
  title:{
    display: "flex", 
    flexGrow: 1, 
    left: 0, 
    paddingTop: '15%', 
    paddingLeft: '15%'  
    //marginLeft: theme.spacing(20)
  }
}));

export default function PlatformProfile(props) {
  const classes = useStyles();
  return ( 
    <Grid container className={classes.PlatformProfileContainer} >
      <Box item sx={{display: 'flex'}} >
        <img className={classes.banner} src={Banner}/></Box>
      <Box item sx={{display: 'flex'}} >
        <img className={classes.icon} src={props.platform_icon}/>
      <Box item sx={{display: 'flex'}} className={classes.title}>
        <Typography variant='h4' ml={2} mt={2}> {props.platform_name}</Typography>
      </Box>
    </Box>
    </Grid>
  )
}


