import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Box,
  IconButton,
  Button,
  Toolbar,
  Divider,
  Typography,
} from "@material-ui/core";
import AccountCircle from "@mui/icons-material/AccountCircle";
import sproutLogo from "../images/sprout.png";
import googleLogin from "../images/google-login-button.png";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import SearchBar from "material-ui-search-bar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { grey } from "@material-ui/core/colors";
import Home from "../pages/Home";
import Leaderboard from "../pages/Leaderboard";
import Platform from "../pages/Platform";
import Search from "../pages/Search";
import PlatformCreator from "../pages/PlatformCreator";
import QuizCreate from "../pages/QuizCreator";
import QuizTake from "../pages/QuizTaking";
import QuizResult from "../pages/QuizResult";
import LoginSucess from "../pages/loginSuccess";
import Profile from "../pages/Profile";

import * as constants from "../components/constants";

const useStyles = makeStyles((theme) => ({
  AppBar: {
    display: "inline-block",
    position: "sticky",
    backgroundColor: "#241452",
    height: 63,
    zIndex: 1250,
  },
  toolbar: theme.mixins.toolbar,
  icon: {
    float: "left",
    marginLeft: "20px",
  },
  leader: {
    float: "right",
    color: "#FFFFFF",
  },
  google: {
    float: "right",
  },
  search: {
    border: 1,
    borderColor: grey,
    borderRadius: 30,
    margin: "0 auto",
    width: 600,
    height: 35,
  },
}));

export default function NavBar() {
  const [state, setState] = useState({
    authenticated: false,
    user: null,
    anchorEl: null,
  });
  const [keyword, setKeyword] = useState("");
  const classes = useStyles();
  const history = useHistory();

  const onCreatePlatform = (e) => {
    e.preventDefault();
    axios
      .post(
        `${constants.API_PATH}/platform`,
        {
          platform_fields: {
            platform_name: "Untitled Platform",
            user_id: state.user.user_id,
          },
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 201) {
          history.push("/platform/" + res.data.platform_id + "/creator");
        }
      })
      .catch((err) => {
        console.log("Sidebar Create Platform Button: ", err);
      });
  };

  const onViewPlatform = (e) => {
    e.preventDefault();
    history.push(`/platform/${state.user.platform_id}`);
  };

  const handleProfileClick = (event) => {
    setState({ ...state, anchorEl: event.currentTarget });
  };

  const onViewProfile = (e) => {
    e.preventDefault();
    history.push(`/profile/${state.user.user_id}`);
  };

  const resetKeyword = () => {
    setKeyword("");
  };

  const handleCloseProfileMenu = () => {
    setState({ ...state, anchorEl: null });
    setKeyword("");
  };

  const fetchAuthUser = async () => {
    const res = await axios
      .get(`${constants.API_PATH}/auth/user`, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log("fetchAuthUser: ", err);
      });
    if (res && res.data) {
      setState({
        authenticated: true,
        user: res.data,
      });
    }
  };

  const redirectToGoogleSSO = async () => {
    const googleLoginURL = `${constants.API_PATH}/auth/google`;
    const nw = window.open(googleLoginURL, "_blank", "width=500, height=600");
    if (nw) {
      let timer;
      timer = setInterval(() => {
        if (nw.closed) {
          fetchAuthUser();
          clearInterval(timer);
        }
      }, 500);
    }
  };

  const handleSignOut = (e) => {
    logout();
    setState({
      ...state,
      authenticated: false,
      user: null,
      anchorEl: null,
    });
  };

  const logout = async () => {
    const res = await axios
      .get(`${constants.API_PATH}/auth/google/logout`, {
        withCredentials: true,
      })
      .catch((err) => {
        console.log("Logout: ", err);
      });
    if (res.status === 200) history.push("/", {});
  };

  const search = (e) => {
    if (e.key === "Enter") {
      setKeyword(e.target.value);
      history.push(`/search/${e.target.value}`);
    }
  };

  useEffect(() => {
    fetchAuthUser();
    resetKeyword();
  }, []);

  const openProfileMenu = Boolean(state.anchorEl ? "basic-menu" : null);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "start",
      }}
    >
      {/**<div className={classes.toolbar} />*/}
      <AppBar className={classes.AppBar} elevation={0}>
        <Toolbar>
          <Link to="/">
            <IconButton p={50} className={classes.icon} onClick={resetKeyword}>
              <img
                float="left"
                width="90"
                height="50"
                alt="sproutlogo"
                src={sproutLogo}
              />
            </IconButton>
          </Link>
          <SearchBar
            className={classes.search}
            placeholder="Search..."
            onKeyPress={search}
          />

          <Link to="/leaderboard">
            <Button className={classes.leader}>Leaderboard</Button>
          </Link>
          {state.authenticated ? (
            <Box>
              <IconButton
                disableRipple
                sx={{ ml: "auto" }}
                size="medium"
                //endIcon={<AccountCircle sx={{ fontSize: 80}}/>}
                aria-owns={openProfileMenu}
                aria-haspopup="true"
                onClick={handleProfileClick}
                color="inherit"
              >
                <Typography variant="subtitle1">
                  {state.user.username}
                </Typography>
                &nbsp;
                <AccountCircle sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          ) : (
            <Button className={classes.google} onClick={redirectToGoogleSSO}>
              <img
                width="155"
                height="35"
                alt="google-signin"
                src={googleLogin}
              />
            </Button>
          )}
          <Menu
            id="basic-menu"
            anchorEl={state.anchorEl}
            open={openProfileMenu}
            onClose={handleCloseProfileMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            //open={Boolean(state.anchorEl)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={onViewProfile}>View Profile</MenuItem>
            <MenuItem
              onClick={
                (handleCloseProfileMenu,
                state.user && state.user.platform_id
                  ? onViewPlatform
                  : onCreatePlatform)
              }
            >
              {" "}
              {state.user && state.user.platform_id
                ? "My Platform"
                : "Create Platform"}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <Home
                user_id={state.user && state.user.user_id}
                platform_id={state.user && state.user.platform_id}
                keyword={keyword}
                {...props}
              />
            )}
          />
          <Route
            path="/search"
            exact
            render={(props) => (
              <Search
                user_id={state.user && state.user.user_id}
                keyword={keyword}
                {...props}
              />
            )}
          />
          <Route
            path="/search/:keyword"
            exact
            render={(props) => (
              <Search
                user_id={state.user && state.user.user_id}
                keyword={keyword}
                {...props}
              />
            )}
          />

          <Route path="/leaderboard" exact component={Leaderboard} />
          <Route
            path="/platform/:platform_id/creator"
            render={(props) => (
              <PlatformCreator
                user_id={state.user && state.user.user_id}
                {...props}
              />
            )}
          />
          <Route
            path="/platform/:platform_id"
            render={(props) => (
              <Platform user_id={state.user && state.user.user_id} {...props} />
            )}
          />
          <Route path="/quiz/:quiz_id/creator" component={QuizCreate} />
          <Route
            path="/quiz/:quiz_id/results"
            render={(props) => (
              <QuizResult
                user_id={state.user && state.user.user_id}
                authenticated={state.authenticated}
                {...props}
              />
            )}
          />
          <Route
            path="/quiz/:quiz_id"
            render={(props) => (
              <QuizTake
                user_id={state.user && state.user.user_id}
                authenticated={state.authenticated}
                {...props}
              />
            )}
          />
          {/*<Route path='/quiz/:quiz_id' component={QuizTake} />*/}
          <Route path="/login/success" component={LoginSucess} />
          <Route
            path="/profile/:user_id"
            render={(props) => <Profile user={state.user} {...props} />}
          />
        </Switch>
      </Box>
    </Box>
  );
}
