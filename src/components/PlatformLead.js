import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { List, ListItem, ListItemText, Toolbar, Typography } from '@material-ui/core';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

const drawerWidth = 220;
const useStyles = makeStyles((theme) => ({
  LeadContainer: {
    display: "flex",
    flexDirection: "column",
    width: '20%',
    padding: '1%',
    zIndex: 'tooltip',
    stroke:'black',
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
    width: 220,
    borderRadius: "15%",
    backgroundColor: "#FFFFFF",
    margin: "5%",
    paddingTop: "18%",
    paddingBottom: "18%",
  }
}));

function PlatformLead(props) {

  const classes = useStyles();  
  const history = useHistory();

  const onViewLeaderProfile = (e, user_id) => {
    e.preventDefault();
    history.push(`/profile/${user_id}`)
  };

  return (
    <Box className={classes.LeadContainer}>
      <Typography variant="h6" align='center' mt={50}>Leaderboard</Typography>
      <Box className={classes.pleaderboard}>
        <List>
          {props.topFiveUsers && props.topFiveUsers.map((user, index) => (
            <ListItem button onClick={e => onViewLeaderProfile(e, user.user_id)} key={index}>
              <ListItemText primary={(index + 1) + "\t" + user.username} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default PlatformLead
