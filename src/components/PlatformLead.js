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
  const [topTen, setTopTen] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    axios.get(`${constants.API_PATH}/platform/${props.platform_id}/users`).
      then(res => {
        console.log(res);
        if (res.status === 200) {
          setTopTen(res.data);
        }
      });
  }, []);
  return (
    <Box className={classes.mainbox}>
      <Drawer anchor="right" variant="permanent" className={classes.drawer}>
        <Toolbar />
        <Typography variant="h6" align='center' mt={50}>Leaderboard</Typography>
        <Box className={classes.pleaderboard}>
          <List>
            {topTen.map((username, index) => (
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
