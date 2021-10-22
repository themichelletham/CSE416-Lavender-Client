import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Item } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar.js';
import * as constants from '../components/constants';

const useStyles = makeStyles( theme => ({
  homePage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1,
    wdith: '60vw'
  },
  gridContainer:{
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
  useEffect(() => {
    axios.get(constants.API_PATH + '/quiz')
    .then( res => {
      console.log(res);
      setState({quizzes: res.data});
    }).catch( err => {
      //console.log(err);
    })
  }, []);
    return (
        <Box className="homePage">
          <Sidebar className={classes.drawer}/>
          <Grid container spacing={10} className={classes.gridContainer}>
            {state.quizzes?state.quizzes.map( quiz => (
              <Grid item className={classes.gridItem}  key={quiz.quiz_id}>
                <Link to={{pathname: `/quiz/creator/${quiz.quiz_id}`, 
                  quiz_id: quiz.quiz_id}} >{quiz.quiz_name}</Link>
              </Grid>
            )):<Grid item></Grid>}
          </Grid>
        </Box>
    )
}

export default Home;
