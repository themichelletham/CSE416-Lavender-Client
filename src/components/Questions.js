import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField, InputAdornment, IconButton } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';
import Answers from "./Answers"

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "#F9F9FF",
  },
  questionWrapper: {
    fontSize: 22,
    paddingBottom: 10,
    paddingLeft: 50,
  },
  questionText: {
    textAlign: 'left',  
    marginTop:10,
    width: '50vw',
    backgroundColor: "#FFFFFF",
  },
  toolbar: theme.mixins.toolbar,
}));

function Questions(props, ref) {
  const classes = useStyles();
  const answersRef = useRef();

  const [questions, setQuestions] = useState([]);
  const [question, setQuestionText] = useState({
    question_text: '',
  })

  useImperativeHandle( ref, () => ({
    getQuestions() {
      return questions;
    }
  }));
  
    //cretes new textbox
  const addQuestion = (e) => {
    let currentquestions = [...questions]
    let newquestion = "New question";
    currentquestions.push(newquestion);
    setQuestions(currentquestions);
  }

  const removeQuestion = index => e => {
    let currentquestions = [...questions]
    currentquestions.splice(index,1)
    setQuestions(currentquestions);
  }

    //updates list of questions
    const onQuestionTextChange = index => e => {
      let tempQuestions = [...questions];
      setQuestionText({...question.question_text, question_text:e.target.value});
      tempQuestions[index] = e.target.value;
      setQuestions(tempQuestions);
    }

    const deleteStyle = {
      backgroundColor: '#8A8AEE',
      marginBottom: 20, 
      marginTop: 20, 
      color: 'black',
      borderRadius: 20,
    }

    const addStyle = {
      backgroundColor: '#8A8AEE',
      left: "8%",
      marginBottom: 10,
      color: 'black',
      width: "50vw",
    }
      
    return(
      <Box className={classes.box}>
      <div className={classes.toolbar} />
      { questions.map((question, index) =>{
          return (
          <Box className={classes.questionWrapper} key={index}> 
          {index+1}. <TextField className={classes.questionText}
            key={index}
            value={questions[index]}
            onChange={onQuestionTextChange(index)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" variant='contained'>
                    <Button style={deleteStyle} variant='contained' onClick={removeQuestion(index)} disableElevation>X</Button>
                </InputAdornment>
              )
            }}
            inputProps={{
              style: {
                padding: 5,
                fontSize: 20,
              }
            }}
          />
            <Answers ref={props, answersRef}/>  
            <div className={classes.toolbar} />   
          </Box>
          );
        })}
        <div className={classes.toolbar} />
        <Button style={addStyle} variant='contained' onClick={addQuestion} >+ Add question</Button>
      </Box>
    );
}

export default forwardRef(Questions);
