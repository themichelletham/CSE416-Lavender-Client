import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';

function Questions(props, ref) {
  

    const questionStyle = {
        backgroundColor: '#ACACE1',
        marginBottom: 10,
        color: 'black'
        
      }
      
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
      
    return(
        //<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'start' }}>
        <Box>
        {
            questions.map((question, index) =>{
              return (
              <Box key={index}> 
              {index}. <TextField
                inputProps={{min: 0, 
                    style: { textAlign: 'center', fontSize: 22, paddingTop:0, paddingBottom:0,
                    marginTop:10}}}
                    key={index}
                value={questions[index]}
                onChange={onQuestionTextChange(index)}
                />
                <Button variant='contained' onClick={removeQuestion(index)}>X</Button>
                </Box>);
            })}
      

        <Button variant='contained' style={questionStyle} onClick={addQuestion} >Add question</Button>
        
        </Box>
       // </Box>
    );
}

export default forwardRef(Questions);