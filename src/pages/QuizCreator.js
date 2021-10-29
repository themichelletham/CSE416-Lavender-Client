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
    width: '60vw', 
  },
  Opt:{
    display: 'inline-block',
    width: '60vw',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center', 
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
    quiz_name: '',
    questions: [],
    answers: [[]],
  })

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const addQuestion = (e) => {
    let currentanswers = state.answers;
    let currentquestions = state.questions;
    let newquestion = "New question";
    currentquestions.push(newquestion);
    currentanswers.push([]);
    setState( {...state, 
      questions : currentquestions});
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
    // let currentanswers = state.answers;
    // let newanswer = "New answer";
    // currentanswers[question_index].push(newanswer);
    // setState( {...state, answers : currentanswers});
    let currentanswers = state.answers[question_index];
    let tempans = state.answers;
    let newanswer = "New answer";
    currentanswers.push(newanswer);
    tempans[question_index] = currentanswers;
    setState( {...state, answers : tempans});
  }

  const removeAnswer = (question_index, answer_index) => e => {
    let currentanswers = state.answers[question_index];
    let tempans = state.answers;
    currentanswers.splice(answer_index,1);
    tempans[question_index] = currentanswers;
    setState( {...state, answers : tempans});
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
  //delete question 
  const deleteQStyle = {
    backgroundColor: '#8A8AEE',
    marginRight: 45,
    marginTop: 20, 
    float: 'right', 
    color: 'black',
    borderRadius: 20
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
  //delete answer button
  const deleteAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginRight: 90,
    marginTop: 11, 
    marginBottom: 10,
    color: 'black',
    float: 'right',
    borderRadius: 20 
  }
  //add answer button 
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
        const newquestions = [];
        const all_answers_data = res.data.answers;
        const newanswers = [[]];
        for (let i = 0; i < all_questions_data.length; i++){
          newquestions.push(all_questions_data[i].question_text)
          for (let j = 0; j < all_answers_data.lengthl; j++) {
            newanswers.push(all_answers_data[i][j].answer_text);
          }
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
      <Box className={classes.Opt} mt={3} >
        <div className={classes.duration}>Duration: INF</div>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onDelete} disableElevation>Delete Quiz</Button>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onSave} disableElevation>Save Quiz</Button>
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
        <div className={classes.quizbody} />  
           {state.questions && state.questions.map((question, question_index) => {
           return( <>
              <Questions
                key={question_index}
                id = {question_index}
                callback={questionCallback}
                questiontext={question}
              />
                <Button style={deleteQStyle} variant='contained' onClick={removeQuestion(question_index)} disableElevation>x</Button>
              {
                state.answers && state.answers[question_index] && 
                state.answers[question_index].map((answer, answer_index) => {
                  return( <>
                    <Answers key={answer_index} id={answer_index} callback={answerCallback} answertext={answer} disableElevation/>
                    <Button style={deleteAnsStyle} variant="contained" onClick={removeAnswer(question_index, answer_index)} disableElevation>X</Button>
                  </>);
                })
              }
              <Button style={addAnsStyle} variant='contained' onClick={addAnswer(question_index)} disableElevation >+ Add answer</Button> 
            </>
           );
          })}
          <Button style={addQStyle} variant='contained' onClick={addQuestion} disableElevation>+ Add question</Button> 
        </Box>
      </FormControl>
    </Box>
  )
}
