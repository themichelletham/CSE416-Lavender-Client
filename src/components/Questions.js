import React, { forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField } from '@mui/material'
import Answers from "./Answers"

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
    marginTop:10,
    width: '50vw',
    backgroundColor: "#FFFFFF",
  },
  toolbar: theme.mixins.toolbar,
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