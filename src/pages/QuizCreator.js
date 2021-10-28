import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as constants from '../components/constants';
import Questions from '../components/Questions';

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
  }
}))


export default function QuizCreate(props) {
  const [state, setState] = useState({
    quiz_name: '',
    questions: [],
    answers: [[]],
  })
  //const [questions, setQuestions] = useState([]);
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

  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/creator`, {
      quiz_fields: {...state}
    }).then( res => {
      // TODO: DO something after udpate
    }).catch( err => {
      console.log('PUT on Save: ', err);
    })
    //let questions = questionsRef.current.getQuestions();
    let questions = state.questions;
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

  /// questions ; []
  /// questions: [[], newquestion]

  const style = {
    backgroundColor: '#ACACE1',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black'
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
          {/* <Questions ref={props, questionsRef}/>      */}
          { state.questions && state.questions.map((question, index) => {
            console.log(index)
           return( <>
              <Questions
              key={index}
              id = {index}
              callback={questionCallback}
              questiontext={question}
              />
              <Button //style={deleteStyle}
               variant='contained' onClick={removeQuestion(index)}>x</Button>
              {/* <Answers ref={props, answersRef}/>   */}
              <div className={classes.toolbar} />  
            </>
           );
          })

          }
          <Button //style={addStyle} 
          variant='contained' onClick={addQuestion} >+ Add question</Button> 
        </Box>
      </FormControl>
    </Box>
  )
}
