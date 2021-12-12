import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Switch, useHistory } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { Toolbar, Divider } from "@material-ui/core";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Profile from "../pages/Profile";
import * as constants from "../components/constants";
import PlatformCreator from "../pages/PlatformCreator";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  homeMain: {
    //flexGrow: 1,
  },
  mainbox: {
    display: "",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#E6E6FA",
      backgroundRepeat: "no-repeat",
    },
  },
  topten: {
    align: "center",
    marginLeft: theme.spacing(10),
    fontWeight: "bold",
    fontSize: "22px",
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const history = useHistory();

  const [topTen, setTopTen] = useState([]);

  const onViewProfile = (e) => {
    history.push(`/profile/${props.user_id}`);
  };

  const onViewPlatform = (e) => {
    history.push(`/platform/${props.platform_id}`);
  };

  const onCreatePlatform = (e) => {
    e.preventDefault();
    axios
      .post(
        `${constants.API_PATH}/platform`,
        {
          platform_fields: {
            platform_name: "Untitled Platform",
            user_id: props.user_id,
          },
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status == 201) {
          history.push("/platform/" + res.data.platform_id + "/creator");
        }
      })
      .catch((err) => {
        console.log("Sidebar Create Platform Button: ", err);
      });
  };

  const onViewLeaderProfile = (e, user_id) => {
    e.preventDefault();
    history.push(`/profile/${user_id}`);
  };

  useEffect(() => {
    axios
      .get(`${constants.API_PATH}/users`, {
        params: {
          limit: 10,
        },
      })
      .then((res) => {
        setTopTen(res.data.map((user) => user));
      })
      .catch((err) => {
        console.log("GET USERS Sidebar: ", err);
      });
  }, []);
  return (
    <Box className={classes.mainbox}>
      <Drawer variant="permanent" className={classes.drawer}>
        <Toolbar />
        <Box>
          <List>
            {props.user_id && (
              <ListItem button key={"View Profile"} onClick={onViewProfile}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>View Profile</ListItemText>
              </ListItem>
            )}
            {props.user_id && (
              <ListItem
                button
                key={"Create Platform"}
                onClick={props.platform_id ? onViewPlatform : onCreatePlatform}
              >
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText>
                  {props.platform_id ? "View Platform" : "Create Platform"}
                </ListItemText>
              </ListItem>
            )}
          </List>
          <Divider />
          <br />
          <Typography variant="h6" ml={4} className={classes.topten}>
            Top 10 Sprouts
          </Typography>
          <List sx={{ marginLeft: 2 }}>
            {topTen.map((user, index) => (
              <ListItem
                button
                key={index}
                onClick={(e) => onViewLeaderProfile(e, user.user_id)}
              >
                <ListItemText primary={index + 1 + ".\t" + user.username} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Switch>
        <Route path="/profile" exact component={Profile} />
        <Route
          path="/platform/:platform_id/creator"
          component={PlatformCreator}
        />
      </Switch>
    </Box>
  );
}
