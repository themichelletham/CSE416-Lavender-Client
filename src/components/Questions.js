import React, { forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField } from '@mui/material'
import Answers from "./Answers"

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
function Questions(props, ref) {
  const classes = useStyles();

  return(
    <Box className={classes.questionWrapper} key={props.id}> 
      {props.id + 1}. 
      <TextField className={classes.questionText}
        key={props.id}
        value={props.questiontext}
        onChange={props.callback(props.id)}
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

export default forwardRef(Questions);