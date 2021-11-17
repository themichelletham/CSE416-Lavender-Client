import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Box, Grid, Button } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/Sidebar.js";
import * as constants from "../components/constants";
import PlatformIcon from "../images/platformicon.jpeg";
import Typography from "@mui/material/Typography";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const ttheme = createTheme();
ttheme.spacing(1);

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "80vw", 
    height: '80vh',
    flexGrow: 1,
    //width: '100%',
    //height: '100%',
  },
  gridContainer: {
    //marginTop: '2%',
    //marginLeft: '10%',
    //width: '90%',
    //display: 'absolute', 
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginLeft: '5%', 
    width: "80vw",
  },
  gridItem: {
    display: "inline-block",
  },
}));

function Home(props) {
  const [state, setState] = useState({
    quizzes: null,
    platforms: null,
  });
  const classes = useStyles();
  const history = useHistory();
  const onNavigateQuiz = (e, quiz_id) => {
    if (!props.user_id) {
      history.push(`/quiz/${quiz_id}`);
    } else {
      axios
        .post(`${constants.API_PATH}/quiz/${quiz_id}/history`, {
          user_id: props.user_id,
        })
        .then((res) => {
          if (res.data.history) {
            history.push(`/quiz/${quiz_id}/results`);
          } else {
            history.push(`/quiz/${quiz_id}`);
          }
        });
    }
  };

  const onNavigatePlatform = (e, platform_id) => {
    axios
      .get(`${constants.API_PATH}/platform/${platform_id}/`, {
        user_id: 1,
      })
      .then((res) => {
        //console.log(res);

        history.push(`/platform/${platform_id}`);
      });
  };

  useEffect(() => {
    axios
      .get(constants.API_PATH + "/platform")
      .then((res) => {
        console.log(res);
        setState({ quizzes: res.data.quizzes, platforms: res.data.platforms });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box className="homePage">
      <Sidebar className={classes.drawer} user_id={props.user_id} />
      <Typography ml={'6%'} mt={ttheme.spacing(.5)} mb={ttheme.spacing(.5)}>
        QUIZZES
      </Typography>
      <Grid container spacing={3} className={classes.gridContainer}>
        {state.quizzes ? (
          state.quizzes.map((quiz) => (
            <Grid item className={classes.gridItem} key={quiz.quiz_id}>
              <Button onClick={(e) => onNavigateQuiz(e, quiz.quiz_id)}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    width="200"
                    image={quiz.icon_photo}
                  />
                  <CardContent>{quiz.quiz_name}</CardContent>
                </Card>
              </Button>
            </Grid>
          ))
        ) : (
          <Grid item></Grid>
        )}
      </Grid>
      <Typography mt={ttheme.spacing(1)} ml={'6%'} mb={ttheme.spacing(.5)}>
        PLATFORMS
      </Typography>
      <Grid container spacing={3} className={classes.gridContainer}>
        {state.platforms ? (
          state.platforms.map((platform) => (
            <Grid item className={classes.gridItem} key={platform.platform_id}>
              <Button
                onClick={(e) => onNavigatePlatform(e, platform.platform_id)}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    width="200"
                    image={platform.icon_photo}
                  />
                  <CardContent>{platform.platform_name}</CardContent>
                </Card>
              </Button>
            </Grid>
          ))
        ) : (
          <Grid item></Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Home;
