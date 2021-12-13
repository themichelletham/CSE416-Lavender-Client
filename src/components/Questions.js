import React from "react";
import { styled } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  questionWrapper: {
    display: "inline-block",
    fontSize: 22,
    marginLeft: theme.spacing(7),
    marginTop: theme.spacing(3),
  },
  questionText: {
    textAlign: "inline-block",
    marginTop: theme.spacing(5),
    width: theme.spacing(95),
    backgroundColor: "#FFFFFF",
  },
  show_correct: {
    textAlign: 'inline-block',
    marginTop: theme.spacing(5),
    width: theme.spacing(95),
    backgroundColor: "#FFFFFF",
    display: 'inline-block',
    textAlign: 'left',
    backgroundColor: '#cbffca'
  },
  show_incorrect: {
    display: 'inline-block',
    textAlign: 'left',
    backgroundColor: '#ffcccc'
  },
  //toolbar: theme.mixins.toolbar,
}));
const IncorrectTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#ce9093',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ce9093',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ce9093',
    },
    '&:hover fieldset': {
      borderColor: '#ce9093',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ce9093',
    },
  },
});

const CorrectTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: "#7cd370",
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: "#7cd370",
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: "#7cd370",
    },
    '&:hover fieldset': {
      borderColor: "#7cd370",
    },
    '&.Mui-focused fieldset': {
      borderColor: "#7cd370",
    },
  },
});

//const EditTextField = styled(TextField)({
//  '& label.Mui-focused': {
//    color: c,
//  },
//  '& .MuiInput-underline:after': {
//    borderBottomColor: c,
//  },
//  '& .MuiOutlinedInput-root': {
//    '& fieldset': {
//      borderColor: c,
//    },
//    '&:hover fieldset': {
//      borderColor: c,
//    },
//    '&.Mui-focused fieldset': {
//      borderColor: c,
//    },
//  },
//});

export default function Questions(props) {
  const classes = useStyles();

  let c;
  if (props.variant === "show-correct")
    c = (<CorrectTextField
      className={classes.questionText}
      key={props.q_key}
      value={props.q_text}
      onChange={(e) => props.q_callback(e, props.q_key)}
      inputProps={{
        readOnly: props.readOnly,
        style: {
          padding: 5,
          fontSize: 16,
        },
      }}
    />)
  else if (props.variant === "show-incorrect") {
    c = (<IncorrectTextField
      className={classes.questionText}
      key={props.q_key}
      value={props.q_text}
      onChange={(e) => props.q_callback(e, props.q_key)}
      inputProps={{
        readOnly: props.readOnly,
        style: {
          padding: 5,
          fontSize: 16,
        },
      }}
    />)
  }
  else {
    c = (<TextField
      className={classes.questionText}
      key={props.q_key}
      value={props.q_text}
      onChange={(e) => props.q_callback(e, props.q_key)}
      inputProps={{
        readOnly: props.readOnly,
        style: {
          padding: 5,
          fontSize: 16,
        },
      }}
    />)
  }

  return (
    <>
      <Box className={classes.questionWrapper} key={props.q_key}>
        {props.q_key + 1}.{" "}
        {c}
      </Box>
    </>
  );
}
