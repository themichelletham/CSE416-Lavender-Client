import React from 'react'
import { Box } from '@mui/system';
import Banner from "../images/banner.png";
import PlatformIcon from "../images/platformicon.jpeg"
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  PlatformProfileContainer: {

  },
  bannerBox: {
    height: "250px",
    width: "100%",
    overflow: "hidden",
    zIndex: "10",
    position: "relative"
  },
  banner: {
    width: "100%",
  },
  icon: {
    height: "150px",
    width: "150px",
    borderRadius: "50%",
  }
}));

export default function PlatformProfile() {
  const classes = useStyles();

  return (
    
    <Box className={classes.PlatformProfileContainer}>
      <Box className={classes.bannerBox}>
        <img className={classes.banner} src={Banner}/>
      </Box>
      <img className={classes.icon} src={PlatformIcon}/>
      <Typography variant="h2">Platform Name  feifehi</Typography>
  
    </Box>
  )
}


