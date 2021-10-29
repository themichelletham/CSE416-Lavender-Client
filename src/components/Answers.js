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
    fontSize: 22,
  },
  answerText: {
    textAlign: 'left',  
    marginTop: 10,
    width: '38vw',
    backgroundColor: "#FFFFFF",
  },
}));

function Answers(props, ref) {
  const classes = useStyles();
      
  return(
    <Box className={classes.answerWrapper} key={props.id}> 
      <TextField className={classes.answerText}
          key={props.id}
          value={props.answerText}
          onChange={e => props.callback(props.id)}
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