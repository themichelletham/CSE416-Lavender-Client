import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import * as constants from '../components/constants';
import { makeStyles } from '@material-ui/core';
import { Box, Button, FormControl,Grid, InputBase, TextField } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from 'react-router-dom';
import PlatformProfile from '../components/PlatformProfile.js';
import PlatformLead from "../components/PlatformLead.js";
import QuizCreate from '../pages/QuizCreator';
import { styled } from '@mui/material/styles';
import { createTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { purple } from '@mui/material/colors'

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#7519BD"),
    backgroundColor: "#7519BD",
    "&:hover": {
      backgroundColor: purple[900]
    }
}));

const useStyles = makeStyles((theme) => ({
  PlatformCreatorContainer: {
    display: "flex",
    overflow:'hidden', 
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'left', 
    width: theme.spacing(200), 
  },
  Opt: {
    //display: 'inline-block',
    width: theme.spacing(200),
    paddingLeft: theme.spacing(117),
    paddingBottom: theme.spacing(.5), 
    alignItems: 'left', 
  },
  editPlatform: {
    borderRadius: 15,
    borderTopLeftRadius: 15,  
  },

  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: theme.spacing(7.5),
    backgroundColor: "#7519BD",
    width: theme.spacing(155), 
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  quiz:{ 
    color: "#FFFFFF", 
    width: theme.spacing(15), 
    height: theme.spacing(10), 
    textAlign: 'center', 
  }
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
      <Box className={classes.Opt} ml={3} mr={1}>
        <Button size='small' variant='contained' onClick={onSave} disableElevation>Save Platform</Button>
        <Button size='small' variant='contained' onClick={onDelete} disableElevation>Delete Platform</Button>
      </Box>
      <FormControl className={classes.editPlatform}>
        <InputBase className={classes.title}
          inputProps={{
            min: 0,
            style: {
              textAlign: 'center', fontSize: 22, paddingTop: 0, paddingBottom: 0,
              marginTop: 10, 
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
          <Grid container spacing={10} ml={1} className={classes.gridContainer}>
            {state.quizzes?state.quizzes.map( quiz => (
              <Grid item className={classes.gridItem}  key={quiz.quiz_id}>
                  <Link to={{pathname: `/quiz/${quiz.quiz_id}`, quiz_id: quiz.quiz_id}}>
                    <ColorButton className={classes.quiz} variant='contained' disableElevation>{quiz.quiz_name}</ColorButton>
                  </Link>
              </Grid>
            )):<Grid item></Grid>}
          </Grid>
        </Box>
    </Box>
  )
}
