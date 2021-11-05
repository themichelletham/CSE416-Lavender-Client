import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Box, Grid, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar.js';
import * as constants from '../components/constants';

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
  })
  const classes = useStyles();
  const history = useHistory();
  const onNavigate = (e, quiz_id) => {
    axios.post(`${constants.API_PATH}/quiz/${quiz_id}/history`, {
      user_id: 1
    }).then(res => {
      console.log(res);
      if (res.data.history) {
        history.push(`/quiz/${quiz_id}/results`);
      }
      else {
        history.push(`/quiz/${quiz_id}`);
      }
    })
  }
  useEffect(() => {
    axios.get(constants.API_PATH + '/quiz')
      .then(res => {
        console.log(res);
        setState({ quizzes: res.data });
      }).catch(err => {
        //console.log(err);
      })
  }, []);
  return (
    <Box className="homePage">
      <Sidebar className={classes.drawer} />
      <Grid container spacing={10} className={classes.gridContainer}>
        {state.quizzes ? state.quizzes.map(quiz => (
          <Grid item className={classes.gridItem} key={quiz.quiz_id}>
            <Button onClick={e => onNavigate(e, quiz.quiz_id)}>{quiz.quiz_name}</Button>
          </Grid>
        )) : <Grid item></Grid>}
      </Grid>
    </Box>
  )
}

export default Home;
