import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button, Box, Grid, Typography, ImageListItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import * as constants from '../components/constants';

const theme = createTheme();
theme.spacing(1);

const useStyles = makeStyles((theme) => ({
  profilePage: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
  },
  banner: {
    width: theme.spacing(166.5),
    height: theme.spacing(30),
    width: "100%",
    overflow: "hidden",
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 'modal',
    background: '#7d65c0'
  },
  icon: {
    float: 'center',
    marginTop: 10,
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(5),
    height: theme.spacing(22),
    width: theme.spacing(22),
    borderRadius: '100%',
    position: 'absolute',
  },
  username: {
    marginTop: theme.spacing(35),
    //marginLeft: theme.spacing(140)
  },
  totalPoints: {

  },
  pointsContainer: {

  }
}));

export default function Profile(props) {
  const [state, setState] = useState({
    user: null,
    points: [],
  });
  const classes = useStyles();
  useEffect(() => {
    axios.get(`${constants.API_PATH}/users/${props.match.params.user_id}`)
      .catch(err => {
        console.log('Profile: ', err);
      }).then(res => {
        console.log(res)
        if (res.status == 200) {
          setState({ user: { ...res.data.user }, points: [...res.data.points] });
        }
      })
  }, [props]);

  return (
    <Box className={classes.profilePage}>
      <Box className={classes.banner} />
      <img className={classes.icon} src={state.user && state.user.picture} />
      <Box className={classes.username}>
        <Typography>{state.user && state.user.username}</Typography>
      </Box>
      <Box className={classes.totalPoints}>
        <Typography>Total Points: {state.user && state.user.points}</Typography>
      </Box>
      <Box className={classes.pointsContianer}>
        {/*state.points.length && state.points.reduce((pairs, value, key) => {
          return (key % 2 === 0 ? pairs.push([key]) : pairs[pairs.length - 1].push(key)) && pairs;
        }).map((pair) => {
          // Trying to display left and right side
          const ret = (
            <Box className={classes.totalPoints}>
              <Typography>
                {`Platform_id:${state.points[pair[0]].platform_id} Points:${state.points[pair[0]].points}`}
              </Typography>
            </Box>
          )
        })
      */}
      </Box>
    </Box>
  )
}