import React from 'react'
import { Box } from '@mui/system';
import Banner from "../images/banner.png";
import PlatformIcon from "../images/platformicon.jpeg"
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { createTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'

const useStyles = makeStyles((theme) => ({
  banner: {
    width: theme.spacing(166.5),
    height: theme.spacing(30),
    width: "100%",
    overflow: "hidden",
    position: 'absolute',
    top: 0,
    left: 0, 
    zIndex: 'modal',
  },
  icon: {
    marginLeft: theme.spacing(8), 
    marginTop: theme.spacing(10),
    //marginBottom: theme.spacing(5), 
    height: theme.spacing(22),
    width: theme.spacing(22),
    borderRadius: "100%",
    position: 'absolute',
    //bottom: 40,
    //left: '40%',
    zIndex: 'tooltip'
  }, 
  title:{ 
    //display: 'inline-block',
    paddingTop: theme.spacing(35),
    paddingLeft : theme.spacing(2), 
  }
}));

export default function PlatformProfile() {
  const classes = useStyles();
  return ( 
    <Box className={classes.PlatformProfileContainer}>
        <img className={classes.banner} src={Banner}/>
        <img className={classes.icon} src={PlatformIcon}/>
      <div className={classes.title}>
        <Typography variant="h3">Platform Name</Typography>
      </div>
    </Box>
  )
}


