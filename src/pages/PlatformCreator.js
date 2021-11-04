import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import * as constants from '../components/constants';
import { makeStyles } from '@material-ui/core';
import { Box, Button, FormControl,Grid, InputBase, TextField } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from 'react-router-dom';
import PlatformProfile from '../components/PlatformProfile.js';
import PlatformLead from "../components/PlatformLead.js";
import QuizCreate from '../pages/QuizCreator';

const useStyles = makeStyles((theme) => ({
  PlatformCreatorContainer: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  Opt: {
    display: 'inline-block',
    width: '60vw',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'left',
  },
  editPlatform: {
    borderRadius: 15,
    borderTopLeftRadius: 15,  
  },
}));

export default function PlatformCreator(props) {
  const [state, setState] = useState({
    platform_name: 'Untitled Platform',
    quizzes: null,
  })

  const copyState = () => {
    let new_name = state.platform_name;
    return [new_name];
  }

  useEffect(() => {
    axios.get(`${constants.API_PATH}/platform/${props.match.params.platform_id}/quizzes`)
    .then( res => {
      console.log(res);
      console.log("hello quizzerjwei")
      setState({platform_name: state.platform_name, quizzes: res.data});
    }).catch( err => {
      console.log(err);
      console.log("notworkign")
    })
    console.log("why not");
  }, []);

  const classes = useStyles();
  const history = useHistory();

  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/platform/${props.match.params.platform_id}/creator`, {
      platform_fields: { platform_name: state.platform_name, }
    }).then(res => {
      // TODO: DO something after udpate
    }).catch(err => {
      console.log('PUT on Save: ', err);
    })
  }

  const onDelete = (e) => {
    axios.delete(`${constants.API_PATH}/platform/${props.match.params.platform_id}`)
    .then(res => {
      history.goBack().goBack();
    }).catch(err => {
      console.log(err);
    })
  }

  const onTitleChange = (e) => {
    let [new_name] = copyState();
    new_name = e.target.value;
    setState({
      platform_name: new_name,
    });
  }

  return (
    <Box className={classes.PlatformCreatorContainer}>
      <PlatformProfile/>
      <PlatformLead/>
      <FormControl className={classes.editPlatform}>
        <InputBase className={classes.title}
          inputProps={{
            min: 0,
            style: {
              fontSize: 32, paddingTop: 0, paddingBottom: 0,
              marginTop: 10
            }
          }}
          value={state.platform_name}
          onChange={onTitleChange}
        />
      </FormControl>
      <Box className={classes.Opt} mt={3}>
        <Button size='small' variant='contained' onClick={onSave} disableElevation>Save Platform</Button>
        <Button size='small' variant='contained' onClick={onDelete} disableElevation>Delete Platform</Button>
      </Box>
      <Box>
          <Grid container spacing={10} className={classes.gridContainer}>
            {state.quizzes?state.quizzes.map( quiz => (
              <Grid item className={classes.gridItem}  key={quiz.quiz_id}>
                <Link to={{pathname: `/quiz/${quiz.quiz_id}`, 
                  quiz_id: quiz.quiz_id}} >{quiz.quiz_name}</Link>
              </Grid>
            )):<Grid item></Grid>}
          </Grid>
        </Box>
    </Box>
  )
}
