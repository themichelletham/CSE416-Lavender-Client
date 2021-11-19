import React, { useState, useEffect } from "react";
import { makeStyles, styled } from "@material-ui/core/styles";
import { Box, Button, FormControl, InputBase, Grid } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: "center",
  },
  duration: {
    display: "inline-block",
    float: "left",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: theme.spacing(8),
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

const returnStyle = {
  backgroundColor: "#8A8AEE",
  left: "8%",
  marginBottom: 10,
  color: "black",
  width: "50vw",
  borderRadius: 20,
  marginTop: 10,
};

export default function QuizResult(props) {
  const [state, setState] = useState({
    platform_id: "",
    platform_title: "",
    quiz_title: "",
    questions: [],
    answers: [],
    selected_answers: [],
  });
  const [previewSource, setPreviewSource] = useState();

  const copyState = () => {
    let ret = {};
    ret.platform_id = state.platform_id;
    ret.platform_title = state.platform_title;
    ret.quiz_title = state.quiz_title;
    ret.questions = state.questions.slice(0);
    ret.answers = state.answers.map((answer_list) =>
      answer_list.map((ans) => {
        return { ...ans };
      })
    );
    ret.selected_answers = state.selected_answers.slice(0);
    return ret;
  };

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const parseToState = (data) => {
    const platform_id = data.platform.platform_id;
    const platform_title = data.platform.platform_name;
    const title = data.quiz.quiz_name;
    const questions = data.questions.map((q_obj) => q_obj.question_text);
    //const answers = data.answers.map(ansrs => { return { ...ansrs } });
    const answers = data.answers.map((answer_list) =>
      answer_list.map((ans) => {
        return { ...ans };
      })
    );
    const selected_answers = data.selected_answers.slice(0);
    console.log(answers);
    return {
      platform_id: platform_id,
      platform_title: platform_title,
      quiz_title: title,
      questions: questions,
      answers: answers,
      selected_answers: selected_answers,
    };
  };

  useEffect(() => {
    if (props.authenticated) {
      axios
        .post(
          `${constants.API_PATH}/quiz/${props.match.params.quiz_id}/view-results`,
          {
            user_id: props.user_id,
            platform_id: state.platform_id,
          }
        )
        .then((res) => {
          let s = parseToState(res.data);
          //s.selected_answers = s.questions.map(q => -1);
          setState(s);
          setPreviewSource(res.data.quiz.icon_photo);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let s = parseToState(props.location.state);
      //s.selected_answers = s.questions.map(q => -1);
      setState(s);
    }
  }, []);

  const ansMap = (ans, q_key, a_key) => {
    let v = "show-neutral";
    if (state.answers[q_key][a_key].is_correct) v = "show-correct";
    else if (state.selected_answers[q_key] == a_key) v = "show-incorrect";
    return (
      <Grid container item key={a_key}>
        <Answers
          a_key={a_key}
          q_key={q_key}
          ans_text={ans}
          variant={v}
          readOnly
          disableElevation
        />
      </Grid>
    );
  };

  const onReturn = (e) => {
    history.push(`/platform/${state.platform_id}`);
  };

  return (
    <Box className={classes.QuizContainer}>
      <h1>{state.platform_title}</h1>
      <img className={classes.icon} src={previewSource} />
      <Box className={classes.Opt} mt={3}>
        <div className={classes.duration}>Duration: INF</div>
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
                      .map((ans, a_key) =>
                        ansMap(ans.answer_text, q_key, a_key)
                      )}
                  </Grid>
                  <Grid direction="column" container item sm={6}>
                    {state.answers[q_key]
                      .slice(
                        parseInt((state.answers[q_key].length + 1) / 2, 10)
                      )
                      .map((ans, a_key) =>
                        ansMap(
                          ans.answer_text,
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
            style={returnStyle}
            variant="contained"
            onClick={onReturn}
            disableElevation
            disabled={state.selected_answers.includes(-1)}
          >
            Return to Platform
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
}
