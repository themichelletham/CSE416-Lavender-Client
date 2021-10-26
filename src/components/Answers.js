import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  answerWrapper: {
    paddingLeft: 50,
    paddingRight: 31,
    paddingBottom: 10,
    fontSize: 22,
  },
  answerText: {
    textAlign: 'left',  
    marginTop:10,
    width: '48vw',
  },
//   toolbar: theme.mixins.toolbar,
}));

function Answers(props, ref) {
  const classes = useStyles();

  const [answers, setAnswers] = useState([]);
  const [answer, setAnswerText] = useState({
    answer_text: '',
  })

  useImperativeHandle( ref, () => ({
    getanswers() {
      return answers;
    }
  }));
  
    //cretes new textbox
  const addAnswer = (e) => {
    let currentanswers = [...answers]
    let newanswer = "New answer";
    currentanswers.push(newanswer);
    setAnswers(currentanswers);
  }

  const removeAnswer = index => e => {
    let currentanswers = [...answers]
    currentanswers.splice(index,1)
    setAnswers(currentanswers);
  }

    //updates list of answers
    const onAnswerTextChange = index => e => {
      let tempAnswers = [...answers];
      setAnswerText({...answer.answer_text, answer_text:e.target.value});
      tempAnswers[index] = e.target.value;
      setAnswers(tempAnswers);
    }

    const deleteStyle = {
      backgroundColor: '#8A8AEE',
      marginLeft: 10,
      marginBottom: 10,
      color: 'black',
      float: "right"
    }

    const addStyle = {
      backgroundColor: '#8A8AEE',
      marginLeft: 10,
      marginBottom: 10,
      marginRight: 10,
      color: 'black',
      float: "right"
    }
      
    return(
      <Box>
      <div className={classes.toolbar} />
      { answers.map((answer, index) =>{
          return (
          <Box className={classes.answerWrapper} key={index}> 
            <TextField className={classes.answerText}
                key={index}
                value={answers[index]}
                onChange={onAnswerTextChange(index)}
                inputProps={{
                style: {
                    padding: 5,
                    fontSize: 20,
                }
            }}
          />
            <Button style={deleteStyle} variant='contained' onClick={removeAnswer(index)}>X</Button>
          </Box>
          );
        })}
        <Button style={addStyle} variant='contained' onClick={addAnswer} >+ Add answer</Button>
      </Box>
    );
}

export default forwardRef(Answers);