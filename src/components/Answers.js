import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  answerWrapper: {
    display: 'inline-block',
    paddingLeft: theme.spacing(18),
    marginTop: theme.spacing(1), 
    marginRight: theme.spacing(2), 
  },
  selected:{
    display: 'inline-block',
    backgroundColor: '#cacaff',
  },
  select: {
    display: 'inline-block',
    textAlign: 'left',  
    backgroundColor: "#FFFFFF",
  },
  answerText: {
    display: 'inline-block',
    textAlign: 'left',  
    width: '38vw',
    backgroundColor: "#FFFFFF",
  },
  show_correct: {
    display: 'inline-block',
    textAlign: 'left',  
    backgroundColor: '#cbffca'
  },
  show_incorrect: {
    display: 'inline-block',
    textAlign: 'left',  
    backgroundColor: '#ffcccc'
  },
  show_neutral: {
    display: 'inline-block',
    textAlign: 'left',  
    backgroundColor: "#FFFFFF",
  },
  correctAns:{
    display: 'inline-block',
    textAlign: 'left',  
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
  else if(props.variant==='show-correct')
    cn = classes.show_correct;
  else if(props.variant==='show-incorrect')
    cn = classes.show_incorrect;
  else if(props.variant==='show-neutral')
    cn = classes.show_neutral;
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
