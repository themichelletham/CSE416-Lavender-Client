import React, { useState } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Box, IconButton, Button, Toolbar, Divider } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import sproutLogo from "../images/sprout.png";
import googleLogin from "../images/google-login-button.png";
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@material-ui/core/colors';
import Home from "../pages/Home"
import Leaderboard from "../pages/Leaderboard"
import Platform from '../pages/Platform';
import PlatformCreator from '../pages/PlatformCreator';
import QuizCreate from '../pages/QuizCreator';
import QuizTake from '../pages/QuizTaking';
import QuizResult from '../pages/QuizResult';
import LoginSucess from '../pages/loginSuccess';
import * as constants from '../components/constants';

const useStyles = makeStyles((theme) => ({
  AppBar: {
    display: 'inline-block',
    position: 'fixed',
    backgroundColor: "#241452",
    height: 63,
    zIndex: 1250,
  },
  toolbar: theme.mixins.toolbar,
  icon: {
    float: 'left',
    marginLeft: "20px",
  },
  leader: {
    float: 'right',
    color: "#FFFFFF"
  },
  google: {
    float: 'right',

  },
  search: {
    border: 1,
    borderColor: grey,
    borderRadius: 30,
    margin: '0 auto',
    width: 600,
    height: 35,
  }
}));

export default function NavBar() {
  const [state, setState] = useState({
    authenticated: false,
    user: null,
    anchorEl: null,
  })
  const classes = useStyles();
  const history = useHistory();

  const onCreateQuiz = (e) => {
    e.preventDefault();
    axios.post(`${constants.API_PATH}/quiz`, {
      quiz_fields: {
        platform_id: 1,
        quiz_name: 'Untitled',
        time_limit: null
      }
    }).then(res => {
      console.log(res)
      if (res.status == 201) {
        history.push('/quiz/creator/' + res.data.quiz.quiz_id, {
          quiz: { ...res.data.quiz },
          platform: { ...res.data.platform }
        });
      }
    }).catch(err => {
      console.log('Create Quiz Button: ', err);
    })
  }

  const onCreatePlatform = (e) => {
    e.preventDefault();
    axios.post(`${constants.API_PATH}/platform`, {
      platform_fields: {
        platform_name: 'Untitled Platform',
        user_id: 1,
      }
    }).then(res => {
      console.log(res)
      if (res.status == 201) {
        console.log('yes owo')
        history.push('/platform/' + res.data.platform_id + '/creator', {
          platform: { ...res.data }
        });
      }
    }).catch(err => {
      console.log('Sidebar Create Platform Button: ', err);
    })
  }

  const handleProfileClick = (event) => {
    setState({ ...state, anchorEl: event.currentTarget });
  };

  const handleCloseProfileMenu = () => {
    setState({ ...state, anchorEl: null });
  };

  const fetchAuthUser = async () => {
    const res = await axios.get(`${constants.API_PATH}/auth/user`, {
      withCredentials: true
    }).catch(err => {
      console.log('fetchAuthUser: ', err);
    });
    if (res && res.data) {
      setState({
        authenticated: true,
        user: res.data,
      })
    }
  }

  const redirectToGoogleSSO = async () => {
    const googleLoginURL = `${constants.API_PATH}/auth/google`
    const nw = window.open(
      googleLoginURL,
      "_blank",
      "width=500, height=600"
    );
    if (nw) {
      let timer;
      timer = setInterval(() => {
        if (nw.closed) {
          fetchAuthUser();
          clearInterval(timer);
        }
      }, 500)
    }
  }

  const logout = async () => {
    const res = await axios.get(`${constants.API_PATH}/auth/google/logout`, {
      withCredentials: true
    }).catch(err => {
      console.log('Logout: ', err);
    })
    history.push('/', {});
  }


  const openProfileMenu = Boolean(state.anchorEl ? 'basic-menu' : null);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'start' }}>
      <div className={classes.toolbar} />
      <AppBar className={classes.AppBar} elevation={0}>
        <Toolbar>
          <Link to="/"><IconButton p={50} className={classes.icon}>
            <img float='left' width="90" height="50" alt="sproutlogo" src={sproutLogo} /></IconButton>
          </Link>
          <SearchBar className={classes.search} placeholder="Search..." />
          <Button className={classes.leader} onClick={onCreateQuiz}>Create Quiz</Button>
          <Link to='/leaderboard'>
            <Button className={classes.leader}>Leaderboard</Button>
          </Link>
          {state.authenticated ?
            (<Box>
              {state.user.username}
              <IconButton
                sx={{ ml: 'auto' }}
                size='large'
                edge='end'
                aria-owns={openProfileMenu}
                aria-haspopup='true'
                onClick={handleProfileClick}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
            </Box>) :
            (<Button className={classes.google}
              onClick={redirectToGoogleSSO}>
              <img width="155" height="35" alt="google-signin" src={googleLogin} />
            </Button>)
          }
          <Menu
            id="basic-menu"
            anchorEl={state.anchorEl}
            open={openProfileMenu}
            onClose={handleCloseProfileMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            open={Boolean(state.anchorEl)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Link to='/profile'>
              <MenuItem onClick={handleCloseProfileMenu}>View Profile</MenuItem>
            </Link>
            <MenuItem onClick={handleCloseProfileMenu, onCreatePlatform}> My Platform</MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseProfileMenu}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/leaderboard" exact component={Leaderboard} />
          <Route path="/platform/:platform_id/creator" component={PlatformCreator} />
          <Route path='/platform/:platform_id' component={Platform} />
          <Route path='/quiz/creator/:quiz_id' component={QuizCreate} />
          <Route path='/quiz/:quiz_id/results' component={QuizResult} />
          <Route path='/quiz/:quiz_id' component={QuizTake} />
          <Route path='/login/success' component={LoginSucess} />
        </Switch>
      </Box>
    </Box>
  );
}