import React from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Box, IconButton, Button, Toolbar } from '@material-ui/core';
import sproutLogo from "../images/sprout.png";
import googleLogin from "../images/google-login-button.png";
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import SearchBar from 'material-ui-search-bar'
import { grey } from '@material-ui/core/colors';
import Home from "../pages/Home"
import Leaderboard from "../pages/Leaderboard"
import QuizCreate from '../pages/QuizCreator';
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
  const classes = useStyles();
  const history = useHistory();
  const onCreateQuiz = (e) => {
    e.preventDefault();
    axios.post(`${constants.API_PATH}/quiz`, {
      quiz_fields: {
        platform_id: 0,
        quiz_name: 'Untitled',
        time_limit: null
      }
    }).then(res => {
      console.log(res)
      if (res.status == 201) {
        console.log('yes')
        history.push('/quiz/creator/' + res.data.quiz_id, {
          quiz: { ...res.data }
        });
      }
    }).catch(err => {
      console.log('Create Quiz Button: ', err);
    })
  }
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
          <IconButton className={classes.google}>
            <img width="155" height="35" alt="google-signin" src={googleLogin} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/leaderboard" exact component={Leaderboard} />
          <Route path='/quiz/creator/:quiz_id' component={QuizCreate} />
        </Switch>
      </Box>
    </Box>
  );
}