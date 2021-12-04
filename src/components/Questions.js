import React from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, TextField } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  questionWrapper: {
    display: 'inline-block',
    fontSize: 22,
    marginLeft: theme.spacing(7),
    marginTop: theme.spacing(3)
  },
  questionText: {
    textAlign: 'inline-block', 
    marginTop: theme.spacing(5),
    width: theme.spacing(95),
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
            readOnly: props.readOnly,
            style: {
              padding: 5,
              fontSize: 16,
            }
          }}
        />
      </Box>
    </>
  );
}
