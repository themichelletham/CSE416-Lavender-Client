import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle, useCallback } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "#F9F9FF",
  },
  questionWrapper: {
    display: 'inline-block',
    fontSize: 22,
    marginLeft: 70,
    marginTop: 20
  },
  questionText: {
    textAlign: 'left',
    marginTop: 10,
    width: '45vw',
    backgroundColor: "#FFFFFF",
  },
  //toolbar: theme.mixins.toolbar,
}));

export default function Questions(props) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.questionWrapper} key={props.q_key}>
        {props.q_key + 1}. <TextField className={classes.questionText}
          key={props.q_key}
          value={props.q_text}
          onChange={e => props.q_callback(e, props.q_key)}
          inputProps={{
            style: {
              padding: 5,
              fontSize: 20,
            }
          }}
        />
      </Box>
    </>
  );
}
