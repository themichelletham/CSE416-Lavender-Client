import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Box, Grid, Button } from '@material-ui/core'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar.js';
import * as constants from '../components/constants';
import PlatformIcon from '../images/platformicon.jpeg'

const useStyles = makeStyles(theme => ({
  homePage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1,
    wdith: '60vw'
  },
  gridContainer: {
    marginTop: 30,
    width: '60vw',
  },
  gridItem: {
    display: 'inline-block'
  }
}))
function Home(props) {
  const [state, setState] = useState({
    quizzes: null,
    platforms: null,
  })
  const classes = useStyles();
  const history = useHistory();
  const onNavigateQuiz  = (e, quiz_id) => {
    axios.post(`${constants.API_PATH}/quiz/${quiz_id}/history`, {
      user_id: 1
    }).then(res => {
      //console.log(res);
      if (res.data.history) {
        history.push(`/quiz/${quiz_id}/results`);
      }
      else {
        history.push(`/quiz/${quiz_id}`);
      }
    })
  }

  const onNavigatePlatform  = (e, platform_id) => {
    axios.get(`${constants.API_PATH}/platform/${platform_id}/`, {
      user_id: 1
    }).then(res => {
      //console.log(res);
      
      history.push(`/platform/${platform_id}`);
      
    })
  }

  useEffect(() => {
    axios.get(constants.API_PATH + '/platform')
      .then(res => {
        console.log(res);
        setState({ quizzes: res.data.quizzes, platforms: res.data.platforms });
      }).catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <Box className="homePage">
      <Sidebar className={classes.drawer} />
      <Grid container spacing={10} className={classes.gridContainer}>
        QUIZZES
        {state.quizzes ? state.quizzes.map(quiz => (
          <Grid item className={classes.gridItem} key={quiz.quiz_id}>
            <Button onClick={e => onNavigateQuiz(e, quiz.quiz_id)}>
              <Card><CardContent>{quiz.quiz_name}
              </CardContent></Card>
            </Button>
          </Grid>
        )) : <Grid item></Grid>}
      </Grid>
      <Grid container spacing={10} className={classes.gridContainer}>
        PLATFORMS
        {state.platforms ? state.platforms.map(platform => (
          <Grid item className={classes.gridItem} key={platform.platform_id}>
            <Button onClick={e => onNavigatePlatform(e, platform.platform_id)}>
              <Card>
                <CardMedia component="img" height="140" image={PlatformIcon}/>
                <CardContent>{platform.platform_name}</CardContent>
              </Card>
            </Button>
          </Grid>
        )) : <Grid item></Grid>}
      </Grid>
    </Box>
  )
}

export default Home;
