import { Button } from '@material-ui/core';
import { Box, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import * as constants from '../components/constants';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlatformLead from "../components/PlatformLead.js";
import PlatformCreator from './PlatformCreator.js';
import PlatformProfile from '../components/PlatformProfile.js';
import { createTheme,  MuiThemeProvider } from '@material-ui/core/styles';
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
        overflow:'hidden', 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'left', 
        width: ttheme.spacing(200), 
    }, 
    editPlat: {
        //marginTop: ttheme.spacing(25), 
        marginLeft: ttheme.spacing(140)
    }
})); 

export default function Platform(props) {
    const classes = useStyles();
    const history = useHistory();
    const [state, setState] = useState({
        platform_name: 'Untitled Platform',
        quizzes: [],
      })
    
      const copyState = () => {
        let new_name = state.platform_name;
        let new_quizzes = [...state.quizzes];
        return [new_name
          , new_quizzes
        ];
      }
    
      useEffect(() => {
        axios.get(`${constants.API_PATH}/platform/${props.match.params.platform_id}`)
        .then( res => {
          console.log(res);
          setState({platform_name: res.data.platform_name,
             quizzes: res.data.quizzes,
          });
        }).catch( err => {
          console.log(err);
          
        })
      }, []);

    return (
        <Box className={classes.PlatformContainer}>
            <Router>
                <PlatformProfile platform_name={state.platform_name}/>
                <PlatformLead/>
            </Router>
            <Link to={`/platform/${props.match.params.platform_id}/creator`}>
                <ColorButton className={classes.editPlat}>Edit Platform</ColorButton>
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
                <Switch>
                    <Route path="/platform/creator" component={PlatformCreator}/>
                </Switch>
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
