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
    marginTop: 10,
    width: '48vw',
    backgroundColor: "#FFFFFF",
  },
}));

export default function Answers(props, ref) {
  const classes = useStyles();
  const deleteStyle = {
    backgroundColor: '#8A8AEE',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black',
    float: "right"
  }

  return (
    <Box className={classes.answerWrapper} >
      <TextField className={classes.answerText}
        key={props.a_key}
        value={props.ans_text}
        onChange={e => props.ans_callback(e, props.q_k, props.a_k)}
        inputProps={{
          style: {
            padding: 5,
            fontSize: 20,
          }
        }}
      />
      <Button style={deleteStyle} variant='contained' onClick={e => props.ansr_callback(e, props.q_k, props.a_k)}>X</Button>
    </Box>
  );
}