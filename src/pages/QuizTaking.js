import React, { useState, useEffect } from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
import { Box, Button, FormControl, InputBase, Grid, Typography } from "@mui/material";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
import * as constants from "../components/constants";
import Questions from "../components/Questions";
import Answers from "../components/Answers";

const useStyles = makeStyles((theme) => ({
  QuizContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "60vw",
  },
  Opt: {
    display: "inline-block",
    width: "60vw",
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  duration: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    float: "left",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeContainer: {
    display: "flex",
    borderRadius: "20%",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#acace1",
    margin: "5%",
    paddingLeft: "15%",
    paddingRight: "15%",
    paddingBottom: "2%",
    paddingTop: "2%",
  },
  time: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 60,
    backgroundColor: "#7d65c0",
  },
  quizForm: {
    borderRadius: 15,
    borderTopLeftRadius: 15,
  },
  noBorder: {
    border: "none",
  },
  quizbody: {
    display: "flex",
    backgroundColor: "#FFFFFF",
  },
  answerWrapper: {
    display: "inline-block",
    paddingLeft: 50,
    paddingRight: 31,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 80,
    fontSize: 22,
  },
}));

const submitStyle = {
  backgroundColor: "#8A8AEE",
  left: "8%",
  marginBottom: 10,
  color: "black",
  width: "50vw",
  borderRadius: 20,
  marginTop: 10,
};

export default function QuizTake(props) {
  const [state, setState] = useState({
    platform_id: 0,
    platform_name: "",
    quiz_title: "",
    questions: [],
    answers: [],
    selected_answers: [],
    redirect: false,
  });
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [previewSource, setPreviewSource] = useState();
  const classes = useStyles();
  const history = useHistory();

  const copyState = () => {
    let ret = {};
    ret.platform_id = state.platform_id;
    ret.platform_name = state.platform_name;
    ret.quiz_title = state.quiz_title;
    ret.questions = state.questions.slice(0);
    ret.answers = state.answers.map((arr) => arr.slice(0));
    ret.selected_answers = state.selected_answers.slice(0);
    ret.redirect = state.redirect;
    return ret;
  };

  const parseToState = (res) => {
    const platform_id = res.data.quiz.platform_id;
    const platform_name = res.data.platform.platform_name;
    const title = res.data.quiz.quiz_name;
    const questions = res.data.questions.map((q_obj) => q_obj.question_text);
    const answers = res.data.answers.map((ans_list) =>
      ans_list.map((ans_obj) => ans_obj.answer_text)
    );
    return {
      platform_id: platform_id,
      platform_name: platform_name,
      quiz_title: title,
      questions: questions,
      answers: answers,
      selected_answers: [],
      redirect: state.redirect,
    };
  };

  const startQuiz = async () => {
    await fetchQuiz();
  };

  const fetchQuiz = async () => {
    let history_res;
    if (props.user_id) {
      history_res = await axios
        .post(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/history`, {
          user_id: props.user_id,
        }).catch(err => {
          console.log('QuizTaking History: ', err);
        });
    }
    if (history_res && history_res.status == 200) {
      setState({ redirect: true })
    }
    else {
      await axios
        .get(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
        .then((res) => {
          let s = parseToState(res);
          s.selected_answers = s.questions.map((q) => -1);
          setState(s);
          let time_limit = res.data.quiz.time_limit;
          if (time_limit !== null && seconds !== 0) {
            setMinutes(Math.floor(time_limit / 60));
            setSeconds(time_limit % 60);
          }
          setPreviewSource(res.data.quiz.icon_photo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if ((seconds || minutes) !== null) {
      let interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        else {
          if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
          else {
            onSubmit(null);
            clearInterval(interval);
          }
        }
      }, 1000)
      return () => {
        clearInterval(interval);
      }
    }
  });

  useEffect(() => {
    fetchQuiz();
    //startQuiz();
  }, []);

  const onSelect = (e, q_k, a_k) => {
    e.preventDefault();
    let s = copyState();
    s.selected_answers[q_k] = a_k;
    setState(s);
  };

  const ansMap = (ans, q_key, a_key) => {
    let v = a_key === state.selected_answers[q_key] ? "selected" : "select";
    return (
      <Grid container item>
        <Answers
          a_key={a_key}
          q_key={q_key}
          ans_text={ans}
          onClick={(e) => onSelect(e, q_key, a_key)}
          variant={v}
          readOnly
          disableElevation
        />
      </Grid>
    );
  };

  const onSubmit = (e) => {
    if (props.authenticated) {
      axios
        .post(
          `${constants.API_PATH}/quiz/${props.match.params.quiz_id}/results`,
          {
            user_id: props.user_id,
            platform_id: state.platform_id,
            selected_answers: state.selected_answers.slice(0),
            duration: null,
          }
        )
        .then((res) => {
          history.push(`/quiz/${props.match.params.quiz_id}/results`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(
          `${constants.API_PATH}/quiz/${props.match.params.quiz_id}/view-results-unauth`,
          {
            platform_id: state.platform_id,
            selected_answers: state.selected_answers.slice(0),
            duration: null,
          }
        )
        .then((res) => {
          history.push(`/quiz/${props.match.params.quiz_id}/results`, {
            platform: res.data.platform,
            quiz: res.data.quiz,
            questions: res.data.questions,
            answers: res.data.answers,
            selected_answers: res.data.selected_answers,
          });
        });
    }
  };

  return state.redirect ? <Redirect to={`/quiz/${props.match.params.quiz_id}/results`} /> : (
    <Box className={classes.QuizContainer}>
      <h1>{state.platform_name}</h1>
      <img className={classes.icon} src={previewSource} />
      <Box className={classes.Opt} mt={3}>
        <Box className={classes.duration}>
          <Typography>Duration: </Typography>
          <Box className={classes.timeContainer}>
            {(minutes || seconds) !== null
              ? (
                <Box className={classes.time}>
                  <Typography>{`${minutes}:${seconds}`}</Typography>
                </Box>
              )
              : <Typography>INF</Typography>
            }
          </Box>
        </Box>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase
          className={classes.title}
          inputProps={{
            readOnly: true,
            min: 0,
            style: {
              textAlign: "center",
              fontSize: 22,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 10,
            },
          }}
          value={state.quiz_title}
        />
        <Box className={classes.box}>
          <div className={classes.quizbody} />
          {state.questions &&
            state.questions.map((question, q_key) => (
              <div key={q_key}>
                <Questions q_key={q_key} q_text={question} readOnly />
                <Grid direction="row" container>
                  <Grid direction="column" container item sm={6}>
                    {state.answers[q_key]
                      .slice(
                        0,
                        parseInt((state.answers[q_key].length + 1) / 2, 10)
                      )
                      .map((ans, a_key) => ansMap(ans, q_key, a_key))}
                  </Grid>
                  <Grid direction="column" container item sm={6}>
                    {state.answers[q_key]
                      .slice(
                        parseInt((state.answers[q_key].length + 1) / 2, 10)
                      )
                      .map((ans, a_key) =>
                        ansMap(
                          ans,
                          q_key,
                          a_key +
                          parseInt((state.answers[q_key].length + 1) / 2, 10)
                        )
                      )}
                  </Grid>
                </Grid>
              </div>
            ))}
          <Button
            style={submitStyle}
            variant="contained"
            onClick={onSubmit}
            disableElevation
            disabled={state.selected_answers.includes(-1)}
          >
            Submit
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
}
