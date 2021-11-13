import { Button, Card, CardContent, CardMedia } from '@material-ui/core';
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
import { purple } from '@mui/material/colors'; 
import AddIcon from '@mui/icons-material/Add';

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
    //marginLeft: ttheme.spacing(3),
    //marginRight: ttheme.spacing(3),
    marginTop: ttheme.spacing(3),
    height: ttheme.spacing(20), 
    width: ttheme.spacing(25), 
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
      <PlatformProfile platform_name={state.platform_name} platform_icon={previewSource}/>
      <PlatformLead />
      <Box className={classes.editPlat}>
        <Link to={`/platform/${props.match.params.platform_id}/creator`}>
        <ColorButton>Edit Platform</ColorButton>
      </Link>
      </Box>
      {/* {previewSource && (<img src={previewSource} alt="chosen"style={{height: '300px'}} />)} */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', maxWidth: ttheme.spacing(150) }}>
        <Grid container spacing={3} ml={4} mt={1} className={classes.gridContainer}>
          {state.quizzes ? state.quizzes.map(quiz => (
            <Grid item className={classes.gridItem} key={quiz.quiz_id}>
              <Link to={{ pathname: `/quiz/${quiz.quiz_id}`, quiz_id: quiz.quiz_id }}>
                <Card>
                  <CardMedia component="img" height="140" width="200" image={quiz.icon_photo}/>
                  <CardContent className={classes.quiz}>{quiz.quiz_name}</CardContent>
                </Card>
              </Link>
            </Grid>
          )) : <Grid item></Grid>}
        </Grid>
      </Box>
    </Box>
  )
}
