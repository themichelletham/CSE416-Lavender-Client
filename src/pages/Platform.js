import { Button, Card, CardContent, CardMedia } from '@material-ui/core';
import { Box, Grid } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import * as constants from '../components/constants';
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlatformLead from "../components/PlatformLead.js";
import PlatformCreator from './PlatformCreator.js';
import PlatformProfile from '../components/PlatformProfile.js';
import { createTheme } from '@material-ui/core/styles';
import SearchBar from "material-ui-search-bar";
import { styled } from '@mui/material/styles';
import { purple, grey } from '@mui/material/colors';

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
    width: '100%',
  },
  gridContainer: {
    display: 'inline-flex', 
    padding: ttheme.spacing(2),
    paddingLeft: '5%',
    marginBottom: ttheme.spacing(40),
    marginLeft: ttheme.spacing(20),
    width: '100%',
  },
  gridItem: {
    display: "inline-block",
    marginBottom: ttheme.spacing(1)
  },
  editPlat: {
    marginLeft: '73%'
  },
  search: {
    border: 1,
    borderColor: grey,
    borderRadius: 30,
    margin: "auto",
    //marginLeft: '25%',
    width: 600,
    height: 35,
  },
  card:{ 
    width: ttheme.spacing(24), 
    height: '100%'
  }
}));

export default function Platform(props) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    platform_name: 'Untitled Platform',
    quizzes: [],
    keyword: "",
  })
  const [previewSource, setPreviewSource] = useState();

  const copyState = () => {
    let new_name = state.platform_name;
    let new_quizzes = [...state.quizzes];
    return {
      platform_name: new_name,
      quizzes: new_quizzes,
    };
  }

  const fetchQuizzes = (keyword) => {
    axios.get(`${constants.API_PATH}/platform/${props.match.params.platform_id}`, {
      params: {
        keyword: keyword,
      }
    }).then(res => {
      console.log(res);
      setState({
        platform_name: res.data.platform_name,
        quizzes: res.data.quizzes,
      });
      setPreviewSource(res.data.icon_photo);
    }).catch(err => {
      console.log(err);
    })
  }

  const search = (e) => {
    if (e.key == "Enter") {
      fetchQuizzes(e.target.value);
    }
  };

  useEffect(() => {
    console.log(props.user_id)
    fetchQuizzes("");
  }, []);

  return (
    <Box className={classes.PlatformContainer}>
      <PlatformProfile platform_name={state.platform_name} platform_icon={previewSource} />
      <PlatformLead platform_id={props.match.params.platform_id} />
      <Box className={classes.editPlat}>
        <Link to={`/platform/${props.match.params.platform_id}/creator`}>
          <ColorButton>Edit Platform</ColorButton>
        </Link>
      </Box>
      <SearchBar
        className={classes.search}
        placeholder="Search..."
        onKeyPress={search}
      />
      {/* {previewSource && (<img src={previewSource} alt="chosen"style={{height: '300px'}} />)} */}
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
      </Box>
      <Box mt={2}>
        <Grid container spacing={3} className={classes.gridContainer}>
          {state.quizzes ? state.quizzes.map(quiz => (
            <Grid item className={classes.gridItem} key={quiz.quiz_id} xs={2} md={2}>
              <Link to={{ pathname: `/quiz/${quiz.quiz_id}`, quiz_id: quiz.quiz_id }}>
                <Card className={classes.card}>
                  <CardMedia component="img" height="140" width="200" image={quiz.icon_photo} />
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
