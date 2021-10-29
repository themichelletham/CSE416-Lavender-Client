import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle, useCallback } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: "#F9F9FF",
  },
  questionWrapper: {
    fontSize: 22,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  questionText: {
    textAlign: 'left',
    marginTop: 10,
    width: '50vw',
    backgroundColor: "#FFFFFF",
  },
  toolbar: theme.mixins.toolbar,
}));

export default function Questions(props) {
  const classes = useStyles();
  const deleteStyle = {
    backgroundColor: '#8A8AEE',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black',
  }

  return (
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
      <Button style={deleteStyle} variant='contained'
        onClick={e => props.qr_callback(e, props.q_key)}>X</Button>
      <div className={classes.toolbar} />
    </Box>
  );
}