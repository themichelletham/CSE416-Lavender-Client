import { Button } from '@material-ui/core';
import { Box, Grid } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import * as constants from '../components/constants';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlatformLead from "../components/PlatformLead.js";
import PlatformCreator from './PlatformCreator.js';
import PlatformProfile from '../components/PlatformProfile.js';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors'

const ttheme = createTheme();
ttheme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#7519BD"),
  backgroundColor: "#7519BD",
  "&:hover": {
    backgroundColor: purple[900]
  }
}));

const useStyles = makeStyles((theme) => ({
  PlatformContainer: {
    display: "flex",
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'left',
    width: ttheme.spacing(200),
  },
  gridContainer: {
    marginBottom: ttheme.spacing(40),
    marginLeft: ttheme.spacing(10),
    width: ttheme.spacing(200),
  },
  editPlat: {
    marginLeft: ttheme.spacing(140)
  },
  createQuiz: {
    marginLeft: ttheme.spacing(0)
  }
}));

export default function Platform(props) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    platform_name: 'Untitled Platform',
    quizzes: [],
  })
  const [previewSource, setPreviewSource] = useState();

  const copyState = () => {
    let new_name = state.platform_name;
    let new_quizzes = [...state.quizzes];
    return [new_name
      , new_quizzes
    ];
  }
  const onCreateQuiz = (e) => {
    e.preventDefault();
    axios.post(`${constants.API_PATH}/quiz`, {
      quiz_fields: {
        platform_id: props.match.params.platform_id,
        quiz_name: 'Untitled',
        time_limit: null
      },
      user_id: props.user_id
    }, { withCredentials: true }).then(res => {
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

  useEffect(() => {
    console.log(props.user_id)
    axios.get(`${constants.API_PATH}/platform/${props.match.params.platform_id}`)
      .then(res => {
        console.log(res);
        setState({
          platform_name: res.data.platform_name,
          quizzes: res.data.quizzes,
        });
        setPreviewSource(res.data.icon_photo);
      }).catch(err => {
        console.log(err);

      })
  }, []);

  return (
    <Box className={classes.PlatformContainer}>
      <PlatformProfile platform_name={state.platform_name} />
      <PlatformLead />
      <Link to={`/platform/${props.match.params.platform_id}/creator`}>
        <ColorButton className={classes.editPlat}>Edit Platform</ColorButton>
      </Link>
      {previewSource && (<img src={previewSource} alt="chosen"style={{height: '300px'}} />)}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', maxWidth: ttheme.spacing(150) }}>
        <Grid container spacing={3} ml={1} mt={1} className={classes.gridContainer}>
          {props.user_id ?
            (<Grid item className={classes.gridItem} key={'Create quiz'}>
             <ColorButton className={classes.createQuiz} onClick={onCreateQuiz}>Create Quiz</ColorButton>
            </Grid>) : <></>}
          {state.quizzes ? state.quizzes.map(quiz => (
            <Grid item className={classes.gridItem} key={quiz.quiz_id}>
              <Link to={{ pathname: `/quiz/${quiz.quiz_id}`, quiz_id: quiz.quiz_id }}>
                <ColorButton className={classes.quiz} variant='contained' disableElevation>{quiz.quiz_name}</ColorButton>
              </Link>
            </Grid>
          )) : <Grid item></Grid>}
        </Grid>
      </Box>
    </Box>
  )
}
