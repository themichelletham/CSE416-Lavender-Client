import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  answerWrapper: {
    display: 'inline-block',
    paddingLeft: 50,
    paddingRight: 31,
    paddingBottom: 10,
    marginTop: 10, 
    marginLeft: 80,
  },
  selected:{
    display: 'inline-block',
    paddingLeft: 50,
    paddingRight: 31,
    paddingBottom: 10,
    marginTop: 10, 
    marginLeft: 80,
    backgroundColor: '#cacaff',
  },
  select: {
    textAlign: 'left',  
    marginTop: 10,
    //width: '38vw',
    backgroundColor: "#FFFFFF",
  },
  answerText: {
    textAlign: 'left',  
    marginTop: 10,
    width: '38vw',
    backgroundColor: "#FFFFFF",
  },
  correctAns:{
    textAlign: 'left',  
    marginTop: 10,
    width: '38vw',
    backgroundColor: "#8ef5c7",
  }
}));

export default function Answers(props) {
  const classes = useStyles();

  let cn;
  if(props.variant==='select')
    cn = classes.select;
  else if(props.variant==='selected')
    cn = classes.selected;
  else 
    cn = props.ans===props.correct_ans?classes.correctAns:classes.answerText
  return (
    <>
      <Box className={classes.answerWrapper} >
        <TextField className={cn}
          key={props.a_key}
          value={props.ans_text}
          onChange={e => props.ans_callback(e, props.q_key, props.a_key)}
          inputProps={{
            readOnly: props.readOnly,
            style: {
              padding: 5,
              fontSize: 16,
            }
          }}
          onClick={props.onClick}
        />
      </Box>
    </>
  );
}
