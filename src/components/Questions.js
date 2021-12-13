import React from "react";
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
<<<<<<< Updated upstream
    textAlign: "inline-block",
=======
    textAlign: 'inline-block',
>>>>>>> Stashed changes
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

export default function Questions(props) {
  const classes = useStyles();

  let c = "";
  if (props.variant === "show-correct")
    c = "#7cd370";
  else if (props.variant === "show-incorrect")
    c = '#ce9093';

  const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: c,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: c,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: c,
      },
      '&:hover fieldset': {
        borderColor: c,
      },
      '&.Mui-focused fieldset': {
        borderColor: c,
      },
    },
  });
  return (
    <>
      <Box className={classes.questionWrapper} key={props.q_key}>
        {props.q_key + 1}.{" "}
        <CssTextField
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
        />
      </Box>
    </>
  );
}
