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
  QuizContainer:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '60vw'
  },
  Opt:{
    display: 'inline-block',
    width: '60vw',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center'
  },
  duration:{
    display: 'inline-block',
    float: 'left',
    fontSize: 16,
    fontWeight: 'bold'
  },
  save:{
    display: 'inline-block',
    float: 'right',
  },
  title:{
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15, 
    height: 60,
    backgroundColor: "#7d65c0",
  },
  quizForm:{
    borderRadius: 15,
    borderTopLeftRadius: 15
  },
  noBorder: {
    border: 'none',
  },
  toolbar: theme.mixins.toolbar,

}))


export default function QuizCreate(props) {
  const [state, setState] = useState({
    quiz_name: '',
    questions: [],
    answers: [[]],
  })

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const addQuestion = (e) => {
    let currentquestions = state.questions;
    let newquestion = "New question";
    currentquestions.push(newquestion);
    setState( {...state, questions : currentquestions});
  }

  const removeQuestion = index => e => {
    let currentquestions = state.questions;
    currentquestions.splice(index,1)
    setState( {...state, questions : currentquestions});
  }

  const questionCallback = key => e => {
    var new_questions = state.questions;
    new_questions[key] = e.target.value;
    setState({...state, questions:new_questions})
  }

  const addAnswer = question_index => (e) => {
    console.log(question_index);
    let currentanswers = state.answers[question_index];
    // console.log(currentanswers);
    let newanswer = "New answer";
    currentanswers.push(newanswer);
    setState( {...state, answers : currentanswers});
  }

  const removeAnswer = index => e => {
    let currentanswers = state.answers[0];
    currentanswers.splice(index,1)
    setState( {...state, answers : currentanswers});
  }

  const answerCallback = key => e => {
    var new_answers = state.answers;
    new_answers[key] = e.target.value;
    setState({...state, answers: new_answers})
  }

  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/creator`, {
      quiz_fields: {...state}
    }).then( res => {
      // TODO: DO something after udpate
    }).catch( err => {
      console.log('PUT on Save: ', err);
    })

    let questions = state.questions;
    let answers = state.answers;

    for ( let i = 0; i < questions.length; i++) {
      console.log(questions[i])
      axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/question`, {
        question_fields: {
          question_id: i,
          quiz_id: props.match.params.quiz_id,
          question_text: questions[i]
        }
      }).then( res => {
        // TODO: DO something after udpate
        
      }).catch( err => {
        console.log('PUT on Save: ', err);
      })
    }
  };

  const style = {
    backgroundColor: '#ACACE1',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black'
  }

  const deleteQStyle = {
    backgroundColor: '#8A8AEE',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black',
  }

  const addQStyle = {
    backgroundColor: '#8A8AEE',
    left: "8%",
    marginBottom: 10,
    color: 'black',
    width: "50vw",
  }

  const deleteAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black',
    float: "right"
  }

  const addAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 10,
    color: 'black',
    float: "right"
  }

  const onDelete = (e) => {
    axios.delete(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then( res => {
        history.goBack()
      }).catch( err => {
        console.log(err);
      })
  }

  const onTitleChange = (e) => {
    setState({...state, quiz_name:e.target.value});
  }

  useEffect(() => {
    if(props.location.state == null){
      axios.get(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then( res => {
        console.log(res);
        // setState({quiz_name: res.data.quiz.quiz_name})
        const all_questions_data = res.data.questions;
        const newquestions = []
        for (let i = 0; i < all_questions_data.length; i++){
            newquestions.push(all_questions_data[i].question_text)
        }

        console.log(newquestions)
        setState({quiz_name: res.data.quiz.quiz_name, questions: newquestions, answers: [[]]})
        console.log(state);
      }).catch( err => {
        console.log(err);
      })
    }
    else if(props.location.state){
      setState({quiz_name: props.location.state.quiz.quiz_name})
    }
  }, [props]);

  return (
    <Box className={classes.QuizContainer}>
      <h1>Platform Name</h1>
      <Box className={classes.Opt} mt={5} >
        <div className={classes.duration}>Duration: INF</div>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onDelete}>Delete Quiz</Button>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onSave}>Save Quiz</Button>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase className={classes.title}
          inputProps={{min: 0, 
            style: { textAlign: 'center', fontSize: 22, paddingTop:0, paddingBottom:0,
              marginTop:10}}}
          value={state.quiz_name}
          onChange={onTitleChange}
        />
        <Box className={classes.box}>
        <div className={classes.toolbar} />  
          { state.questions && state.questions.map((question, question_index) => {
           return( <>
              <Questions
              key={question_index}
              id = {question_index}
              callback={questionCallback}
              questiontext={question}
              />
              <Button style={deleteQStyle} variant='contained' onClick={removeQuestion(question_index)}>x</Button>
              <div className={classes.toolbar} />  
              {state.answers && state.answers.map((answer, answer_index) => {
                <>
                  <Answers key={answer_index} id={answer_index} callback={answerCallback} answertext={answer} />
                  <Button style={deleteAnsStyle} variant="contained" onClick={removeAnswer(question_index, answer_index)}>X</Button>
                </>
              })}
              <Button style={addAnsStyle} variant='contained' onClick={addAnswer(question_index)} >+ Add answer</Button> 
              <div className={classes.toolbar} />  

            </>
           );
          })}
          <Button style={addQStyle} variant='contained' onClick={addQuestion} >+ Add question</Button> 
        </Box>
      </FormControl>
    </Box>
  )
}
