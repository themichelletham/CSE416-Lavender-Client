import React, { useState, useEffect } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField, Grid, ListItem } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as constants from '../components/constants';
import Questions from '../components/Questions';
import Answers from '../components/Answers';

const useStyles = makeStyles((theme) => ({
  QuizContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '60vw',
  },
  Opt: {
    display: 'inline-block',
    width: '60vw',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
  duration: {
    display: 'inline-block',
    float: 'left',
    fontSize: 16,
    fontWeight: 'bold'
  },
  save: {
    display: 'inline-block',
    float: 'right',
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 60,
    backgroundColor: "#7d65c0",
    '& input:disabled': {
      color: '#000000',
    }
  },
  quizForm: {
    borderRadius: 15,
    borderTopLeftRadius: 15,
  },
  noBorder: {
    border: 'none',
  },
  quizbody: {
    display: 'flex',
    backgroundColor: "#FFFFFF",
  },
  textField: {
    '& input:disabled': {
      color: '#000000',
    }
  },
  answerWrapper: {
    display: 'inline-block',
    paddingLeft: 50,
    paddingRight: 31,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 80,
    fontSize: 22,
  },
  //toolbar: theme.mixins.toolbar,
}))

export default function QuizTake(props) {
  const [state, setState] = useState({
    platform_title: '',
    quiz_title: '',
    questions: [],
    answers: [],
    correct_answers: [],
    selected_answers: [],
  })
  const copyState = () => {
    let ret = {};
    ret.platform_title = state.platform_title;
    ret.quiz_title = state.quiz_title;
    ret.questions = state.questions.slice(0);
    ret.answers = state.answers.map(arr => arr.slice(0));
    ret.correct_answers = state.correct_answers.slice(0);
    ret.selected_answers = state.selected_answers;
    return ret;
  }

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const parseToState = (res) => {
    const title = res.data.quiz.quiz_name;
    const questions = res.data.questions.map(q_obj => q_obj.question_text)
    const answers = res.data.answers.map(ans_list => (
      ans_list.map(ans_obj => ans_obj.answer_text)
    ));
    const correct_answers = res.data.answers.map(ans_list => (
      ans_list.filter(ans_obj => ans_obj.is_correct).map(ans_objb => ans_objb.answer_text)
    ));
    return { quiz_title: title, questions: questions, answers: answers, correct_answers: correct_answers, selected_answers: [] };
  }

  useEffect(() => {
    if (props.location.state == null) {
      axios.get(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
        .then(res => {
          console.log(res);
          let s = parseToState(res);
          s.selected_answers = s.questions.map(q => -1);
          setState(s);
        }).catch(err => {
          console.log(err);
        })
    }
    else if (props.location.state) {
      setState({
        quiz_title: props.location.state.quiz.quiz_name,
        questions: [],//new_questions,
        answers: [],//new_answers,
        correct_answers: [], //new correct answers,
      });
    }
  }, [props]);

  const onSelect = (e, q_k, a_k) => {
    e.preventDefault();
    let s = copyState();
    s.selected_answers[q_k] = a_k;
    setState(s);
  }

  const ansMap = (ans, q_key, a_key) => {
    let v = a_key === state.selected_answers[q_key] ? 'selected' : 'select';
    return (
      <Grid container item>
        <Answers a_key={a_key} q_key={q_key} ans_text={ans} onClick={e => onSelect(e, q_key, a_key)} variant={v} readOnly disableElevation />
      </Grid>
    );
  }
  return (
    <Box className={classes.QuizContainer}>
      <h1>Platform Name</h1>
      <Box className={classes.Opt} mt={3} >
        <div className={classes.duration}>Duration: INF</div>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase className={classes.title}
          inputProps={{
            readOnly: true,
            min: 0,
            style: {
              textAlign: 'center', fontSize: 22, paddingTop: 0, paddingBottom: 0,
              marginTop: 10,
            }
          }}
          value={state.quiz_title} />
        <Box className={classes.box}>
          <div className={classes.quizbody} />
          {state.questions && state.questions.map((question, q_key) => (
            <div key={q_key}>
              <Questions q_key={q_key} q_text={question} readOnly />
              <Grid direction='row' container >
                <Grid direction='column' container item sm={6}>
                  {state.answers[q_key].slice(0, (state.answers[q_key].length + 1) / 2).map((ans, a_key) => ansMap(ans, q_key, a_key))}
                </Grid>
                <Grid direction='column' container item sm={6}>
                  {state.answers[q_key].slice((state.answers[q_key].length + 1) / 2).map((ans, a_key) => ansMap(ans, q_key, a_key + (state.answers[q_key].length + 1) / 2))}
                </Grid>
              </Grid>
            </div>
          ))}
        </Box>
      </FormControl>
    </Box>
  );
}