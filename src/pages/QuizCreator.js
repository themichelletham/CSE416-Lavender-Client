import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as constants from '../components/constants';
import Questions from '../components/Questions';
import Answers from '../components/Answers';
import { DoorBack } from '@mui/icons-material';

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
  },
  quizForm: {
    borderRadius: 15,
    borderTopLeftRadius: 15,  
  },
  noBorder: {
    border: 'none',
  },
  quizbody:{ 
    display: 'flex', 
    backgroundColor: "#FFFFFF", 
  }, 
  //toolbar: theme.mixins.toolbar,
}))

export default function QuizCreate(props) {
  const [state, setState] = useState({
    quiz_title: '',
    questions: [],
    answers: [],
  })

  const copyState = () => {
    let new_title = state.quiz_title;
    let new_questions = [...state.questions];
    let new_answers = state.answers.map((arr) => arr.slice());
    return [new_title, new_questions, new_answers];
  }

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const style = {
    backgroundColor: '#ACACE1',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black'
  }

  const addQStyle = {
    backgroundColor: '#8A8AEE',
    left: "8%",
    marginBottom: 10,
    color: 'black',
    width: "50vw",
    borderRadius: 20,
    marginTop: 10,
  }

  const deleteQStyle = {
    backgroundColor: '#8A8AEE',
    marginRight: 45,
    marginTop: 20,
    float: 'right',
    color: 'black',
    borderRadius: 20
  }

  const addAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginTop: 50,
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
    color: 'black',
    float: 'right',
    borderRadius: 20,
  }

  const deleteAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginRight: 90,
    marginTop: 11,
    marginBottom: 10,
    color: 'black',
    float: 'right',
    borderRadius: 20
  }

  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/creator`, {
      quiz_fields: { quiz_name: state.quiz_title, }
    }).then(res => {
      // TODO: DO something after udpate
    }).catch(err => {
      console.log('PUT on Save: ', err);
    })

    var questions_fields = state.questions.map((q) => (
      { quiz_id: props.match.params.quiz_id, question_text: q }
    ));
    var answers_fields = state.answers.map((ans_arr) => {
      return ans_arr.map((ans) => ({ answer_text: ans, is_correct: false }));
    });
    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/question`, {
      questions_fields: questions_fields,
      answers_fields: answers_fields,
    }).then(res => {
      // TODO: DO something after udpate
    }).catch(err => {
      console.log('PUT on Save: ', err);
    })
  };

  const onDelete = (e) => {
    axios.delete(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then(res => {
        history.goBack()
      }).catch(err => {
        console.log(err);
      })
  }

  const onTitleChange = (e) => {
    let [new_title, new_questions, new_answers] = copyState();
    new_title = e.target.value;
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
    });
  }

  const onQuestionChange = (e, q_k) => {
    let [new_title, new_questions, new_answers] = copyState();
    new_questions[q_k] = e.target.value;
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
    });
  }

  const addQuestion = (e) => {
    let [new_title, new_questions, new_answers] = copyState();
    new_questions.push('New question');
    new_answers.push([]);
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
    });
  }

  const removeQuestion = (e, q_k) => {
    let [new_title, new_questions, new_answers] = copyState();
    new_questions.splice(q_k, 1);
    new_answers.splice(q_k, 1);
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
    });
  }

  const onAnswerChange = (e, q_k, a_k) => {
    let [new_title, new_questions, new_answers] = copyState();
    new_answers[q_k][a_k] = e.target.value;
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
    });
  }

  const addAnswer = (e, q_k) => {
    let [new_title, new_questions, new_answers] = copyState();
    new_answers[q_k].push('New answer');
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
    });
  }

  const removeAnswer = (e, q_k, a_k) => {
    let [new_title, new_questions, new_answers] = copyState();
    new_answers[q_k].splice(a_k, 1);
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
    });
  }

  const parseToState = (res) => {
    const title = res.data.quiz.quiz_name;
    const questions = res.data.questions.map(q_obj => q_obj.question_text)
    const answers = res.data.answers.map(ans_list => (
      ans_list.map(ans_obj => ans_obj.answer_text)
    ));
    return { quiz_title: title, questions: questions, answers: answers };
  }
  useEffect(() => {
    if (props.location.state == null) {
      axios.get(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
        .then(res => {
          console.log(res);
          setState(parseToState(res));
        }).catch(err => {
          console.log(err);
        })
    }
    else if (props.location.state) {
      setState({
        quiz_title: props.location.state.quiz.quiz_name,
        questions: [],//new_questions,
        answers: [],//new_answers,
      });
    }
  }, [props]);

  return (
    <Box className={classes.QuizContainer}>
      <h1>Platform Name</h1>
      <Box className={classes.Opt} mt={3} >
        <div className={classes.duration}>Duration: INF</div>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onDelete} disableElevation>Delete Quiz</Button>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onSave} disableElevation>Save Quiz</Button>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase className={classes.title}
          inputProps={{
            min: 0,
            style: {
              textAlign: 'center', fontSize: 22, paddingTop: 0, paddingBottom: 0,
              marginTop: 10
            }
          }}
          value={state.quiz_title}
          onChange={onTitleChange} />
        <Box className={classes.box}>
          <div className={classes.quizbody} />
          {state.questions && state.questions.map((question, q_key) => (
            <div key={q_key}>
              <Questions
                q_key={q_key}
                q_callback={onQuestionChange}
                q_text={question}
              />
              <Button style={deleteQStyle} variant='contained' onClick={e => removeQuestion(e, q_key)} disableElevation>X</Button>
              {state.answers[q_key].map((ans, a_key) => (
                <div key={a_key}>
                  <Answers a_key={a_key} q_key={q_key} ans_callback={onAnswerChange} ans_text={ans} disableElevation />
                  <Button style={deleteAnsStyle} variant='contained' onClick={e => removeAnswer(e, q_key, a_key)}>X</Button>
                </div>
              ))}
              <Button style={addAnsStyle} variant='contained' onClick={e => addAnswer(e, q_key)} disableElevation>+ Add answer</Button>
            </div>
          ))}
          <Button style={addQStyle} variant='contained' onClick={addQuestion} disableElevation>+ Add question</Button>
        </Box>
      </FormControl>
    </Box>
  )
}
