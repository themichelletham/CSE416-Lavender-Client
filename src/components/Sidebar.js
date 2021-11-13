import React from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { List, ListItem, ListItemText, ListItemIcon, Toolbar, Divider } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Profile from "../pages/Profile"
import Platform from "../pages/Platform"
import * as constants from '../components/constants';
import PlatformCreator from '../pages/PlatformCreator';

const drawerWidth = 205;

const useStyles = makeStyles((theme) => ({
  homeMain: {
    //flexGrow: 1,
  },
  mainbox: {
    display: "flex",
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
  topten: {
    align: "center",
    marginLeft: theme.spacing(2.5),
    fontWeight: "bold",
    fontSize: "22px",
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const history = useHistory();

  const onViewProfile = (e) => {
    history.push(`/profile/${props.user_id}`)
  }

  const onCreatePlatform = (e) => {
    e.preventDefault();
    axios.post(`${constants.API_PATH}/platform`, {
      platform_fields: {
        platform_name: 'Untitled Platform',
        user_id: props.user_id,
      }
    }).then(res => {
      console.log(res)
      if (res.status == 201) {
        history.push('/platform/' + res.data.platform_id + '/creator', {
          platform: { ...res.data }
        });
      }
    }).catch(err => {
      console.log('Sidebar Create Platform Button: ', err);
    })
  }

  return (
    <Box className={classes.mainbox}>
      <Drawer variant="permanent" className={classes.drawer}>
        <Toolbar />
        <Box>
          <List>
            {props.user_id &&
              (<ListItem button key={"View Profile"} onClick={onViewProfile}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>
                  View Profile
                </ListItemText>
              </ListItem>)
            }
            <ListItem button key={"Create Platform"} onClick={onCreatePlatform}>
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText>
                Create Platform
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <br />
          <Typography className={classes.topten}>Top 10 Sprouts</Typography>
          <List>
            {["annie", "judy", "michelle", "steven"].map((text, index) => (
              <ListItem>
                <ListItemText primary={(index + 1) + "\t" + text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
     
      <Switch>
        <Route path="/profile" exact component={Profile} />
        <Route path="/platform/:platform_id/creator" component={PlatformCreator} />
      </Switch>
    </Box>
  )
}
