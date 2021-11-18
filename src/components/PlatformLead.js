import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as constants from './constants';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, ListItemText, Toolbar, Typography } from '@material-ui/core';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { padding } from '@mui/system';

const drawerWidth = 220;
const useStyles = makeStyles((theme) => ({
  mainbox: {
    display: "flex",
    zIndex: 'tooltip',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: "#E6E6FA",
      backgroundRepeat: "no-repeat",
    }
  },
  pleaderboard: {
    borderRadius: "12%",
    backgroundColor: "#FFFFFF",
    margin: "5%",
  }
}));

function PlatformLead(props) {

  const classes = useStyles();

  return (
    <Box className={classes.mainbox}>
      <Drawer anchor="right" variant="permanent" className={classes.drawer}>
        <Toolbar />
        <Typography variant="h6" align='center' mt={50}>Leaderboard</Typography>
        <Box className={classes.pleaderboard}>
          <List>
            {props.topFiveUsers.map((username, index) => (
              <ListItem>
                <ListItemText primary={(index + 1) + "\t" + username} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default PlatformLead
