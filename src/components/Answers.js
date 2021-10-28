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
    <Box className={classes.answerWrapper} key={index}> 
      <TextField className={classes.answerText}
          key={index}
          value={answers[index]}
          // onChange={onAnswerTextChange(index)}
          onChange={e => props.callback(e, props.key)}
          inputProps={{
          style: {
              padding: 5,
              fontSize: 20,
          }
        }}
      />
    </Box>
  );
}

export default forwardRef(Answers);