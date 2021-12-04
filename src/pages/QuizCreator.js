import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  FormControl,
  InputBase,
  Input,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import axios from "axios";
import * as constants from "../components/constants";
import Questions from "../components/Questions";
import Answers from "../components/Answers";
import { DoorBack, Login } from "@mui/icons-material";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CircleIcon from "@mui/icons-material/CircleOutlined";
import Alert from "@mui/material/Alert";

const useStyles = makeStyles((theme) => ({
  QuizContainer: {
    //paddingTop: '5%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: theme.spacing(120),
    overflowX: "hidden",
  },
  Opt: {
    display: "inline-block",
    width: theme.spacing(120),
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  duration: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    float: "left",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeContainer: {
    display: "flex",
    borderRadius: "20%",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#acace1",
    margin: "5%",
    paddingLeft: "15%",
    paddingRight: "15%",
    //paddingBottom: "2%",
    paddingTop: "2%",
  },
  time: {
    display: "flex",
    flexDirection: "row",
  },
  timeInput: {
    display: "flex",
    width: "1.5rem",
    alignItems: "center",
    align: "right",
    margin: 0,
  },
  save: {
    display: "inline-block",
    float: "right",
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 60,
    backgroundColor: "#7d65c0",
  },
  quizForm: {
    borderRadius: 15,
    borderTopLeftRadius: 15,
  },
  noBorder: {
    border: "none",
  },
  quizbody: {
    display: "flex",
  },
  answer: {
    display: "flex",
    width: "100%",
  },
  editThumbnail: {
    display: "inline-block",
    width: theme.spacing(200),
    paddingLeft: theme.spacing(68),
    zIndex: "tooltip",
  },
  icon: {
    paddignLeft: 10,
    maxHeight: "100%",
    maxWidth: "100%",
  },
  //toolbar: theme.mixins.toolbar,
}));

export default function QuizCreate(props) {
  const [redirect, setRedirect] = useState(false);
  const [state, setState] = useState({
    platform_name: "",
    quiz_title: "",
    questions: [],
    answers: [],
    correct_answers: [],
  });
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [previewSource, setPreviewSource] = useState();
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [cloudinaryErr, setCloudinaryErr] = useState("");

  const copyState = () => {
    let ret = {};
    ret.platform_name = state.platform_name;
    ret.quiz_title = state.quiz_title;
    ret.questions = [...state.questions];
    ret.answers = state.answers.map((arr) => arr.slice());
    ret.correct_answers = [...state.correct_answers];
    return ret;
  };

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const theme = createTheme();
  theme.spacing(1); // `${8 * 2}px` = '16px'

  const style = {
    backgroundColor: "#ACACE1",
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: "black",
  };

  const addQStyle = {
    backgroundColor: "#8A8AEE",
    left: theme.spacing(11),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(8),
    color: "black",
    width: theme.spacing(95),
    borderRadius: 20,
  };

  const addAnsStyle = {
    backgroundColor: "#8A8AEE",
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(5),
    color: "black",
    float: "right",
    borderRadius: 20,
  };

  const deleteQStyle = {
    backgroundColor: "#8A8AEE",
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(3),
    float: "right",
    color: "black",
    borderRadius: 20,
  };

  const deleteAnsStyle = {
    backgroundColor: "#8A8AEE",
    marginTop: theme.spacing(1),
    color: "black",
    float: "right",
    borderRadius: 20,
  };

  const correctAnsStyle = {
    backgroundColor: "#8A8AEE",
    marginTop: theme.spacing(1),
    color: "black",
    float: "right",
    borderRadius: 20,
  };

  const onDurationToggle = (e) => {
    if (e.target.checked) {
      setMinutes(60);
      setSeconds(0);
    } else {
      setMinutes(null);
      setSeconds(null);
    }
  };

  const onMinutesChange = (e) => {
    e.preventDefault();
    setMinutes(Math.min(Math.max(e.target.value, 0), 999));
  };

  const onSecondsChange = (e) => {
    e.preventDefault();
    setSeconds(Math.min(Math.max(e.target.value, 0), 59));
  };

  const onSave = (e) => {
    const totalSeconds = minutes * 60 + seconds;
    axios
      .put(
        `${constants.API_PATH}/quiz/${props.match.params.quiz_id}/creator`,
        {
          quiz_fields: {
            quiz_name: state.quiz_title,
            time_limit: totalSeconds,
          },
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // TODO: DO something after udpate
      })
      .catch((err) => {
        console.log("PUT on Save: ", err);
      });

    var questions_fields = state.questions.map((q) => ({
      quiz_id: props.match.params.quiz_id,
      question_text: q,
    }));
    var answers_fields = state.answers.map((ans_arr, index) => {
      return ans_arr.map((ans, a_key) => ({
        answer_text: ans,
        is_correct: state.correct_answers[index][0] === a_key,
      }));
    });

    axios
      .put(
        `${constants.API_PATH}/quiz/${props.match.params.quiz_id}/question`,
        {
          questions_fields: questions_fields,
          answers_fields: answers_fields,
        }
      )
      .then((res) => {
        // TODO: DO something after udpate
      })
      .catch((err) => {
        console.log("PUT on Save: ", err);
      });
    uploadImage();
    history.goBack();
  };

  const onDelete = (e) => {
    axios
      .delete(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then((res) => {
        history.goBack();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onTitleChange = (e) => {
    let new_state = copyState();
    new_state.quiz_title = e.target.value;
    setState(new_state);
  };

  const onQuestionChange = (e, q_k) => {
    let new_state = copyState();
    new_state.questions[q_k] = e.target.value;
    setState(new_state);
  };

  const addQuestion = (e) => {
    let new_state = copyState();
    new_state.questions.push("New question");
    new_state.answers.push(["New Answer", "New Answer"]);
    new_state.correct_answers.push([0]);
    setState(new_state);
  };

  const removeQuestion = (e, q_k) => {
    let new_state = copyState();
    new_state.questions.splice(q_k, 1);
    new_state.answers.splice(q_k, 1);
    new_state.correct_answers.splice(q_k, 1);
    setState(new_state);
  };

  const onAnswerChange = (e, q_k, a_k) => {
    let new_state = copyState();
    //new_correct_answers[q_k][0] = a_k;
    //if ( new_answers[q_k][a_k] === new_correct_answers[q_k][0]){
    //  new_correct_answers[q_k][0] = e.target.value;
    //}
    new_state.answers[q_k][a_k] = e.target.value;
    setState(new_state);
  };

  const addAnswer = (e, q_k) => {
    let new_state = copyState();
    new_state.answers[q_k].push("New answer");
    setState(new_state);
  };

  //adds/changes correct answer
  //this list will be used to compare with the other answers in the list to see which is correct
  const makeCorrect = (e, q_k, a_k) => {
    let new_state = copyState();
    new_state.correct_answers[q_k] = [a_k];
    setState(new_state);
  };

  const removeAnswer = (e, q_k, a_k) => {
    let new_state = copyState();
    new_state.answers[q_k].splice(a_k, 1);
    if (a_k < new_state.correct_answers[q_k][0]) {
      new_state.correct_answers[q_k][0]--;
    } else if (a_k === new_state.correct_answers[q_k][0]) {
      new_state.correct_answers[q_k][0] = 0;
    }
    setState(new_state);
  };

  const parseToState = (res) => {
    const platform_name = res.data.platform.platform_name;
    const title = res.data.quiz.quiz_name;
    const questions = res.data.questions.map((q_obj) => q_obj.question_text);
    const answers = res.data.answers.map((ans_list) =>
      ans_list.map((ans_obj) => ans_obj.answer_text)
    );
    const correct_answers = res.data.answers.map((ans_list) => {
      const ca = [];
      for (let i = 0; i < ans_list.length; ++i) {
        if (ans_list[i].is_correct) {
          ca.push(i);
        }
      }
      //console.log(ca);
      //ans_list.filter(ans_obj => ans_obj.is_correct).map(ans_objb => ans_objb.answer_text)
      return ca;
    });
    return {
      platform_name: platform_name,
      quiz_title: title,
      questions: questions,
      answers: answers,
      correct_answers: correct_answers,
    };
  };

  useEffect(() => {
    axios
      .get(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/creator`, {
        withCredentials: true,
      })
      .then((res) => {
        setState(parseToState(res));
        let seconds = res.data.quiz.time_limit;
        if (seconds !== null && seconds !== 0) {
          setMinutes(Math.round(seconds / 60));
          setSeconds(seconds % 60);
        }
        setUrl(res.data.icon_photo);
      })
      .catch((err) => {
        console.log(err);
        setRedirect(true);
      });
  }, []);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 10485760) {
      setCloudinaryErr("File size too large (Max file size: 10485760 bytes)");
      return;
    }
    if (!file) return;
    console.log(file);
    setImage(file);
    setCloudinaryErr("");
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUrl(reader.result);
    };
  };

  const imageDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "sprout");
    data.append("cloud_name", "lavender-sprout-herokuapp-com");

    //please note: Maximum file size is 10485760, may out to display this
    fetch(
      `https://api.cloudinary.com/v1_1/lavender-sprout-herokuapp-com/image/upload`,
      {
        method: "post",
        body: data,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        setCloudinaryErr("");
      })
      .catch((err) => {
        console.log(err);
        setCloudinaryErr(err.message);
      });
  };

  const uploadImage = () => {
    axios
      .put(
        `${constants.API_PATH}/quiz/${props.match.params.quiz_id}/image-upload`,
        {
          quiz_fields: { icon_photo: url },
        }
      )
      .then((res) => {
        //stuff
        console.log(res);
        console.log("image sent");
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hasDuration = minutes || seconds;
  return redirect ? (
    <Redirect to={`/`} />
  ) : (
    <Box className={classes.QuizContainer}>
      <h1>{state.platform_name}</h1>
      <img className={classes.icon} src={url} />
      <Box className={classes.editThumbnail}>
        <Input
          size="small"
          type="file"
          name="image"
          accept=".jpg .png .jpeg"
          multiple={false}
          onChange={handleFileInputChange}
        ></Input>
        {cloudinaryErr !== "" ? (
          <Alert severity="error">{cloudinaryErr}</Alert>
        ) : (
          <></>
        )}
      </Box>
      <Box className={classes.Opt} mt={3}>
        <Box className={classes.duration}>
          <Typography>Duration: </Typography>
          <Box className={classes.timeContainer}>
            {hasDuration !== null ? (
              <Box className={classes.time}>
                <InputBase
                  className={classes.timeInput}
                  type={"number"}
                  size={"small"}
                  onChange={onMinutesChange}
                  value={minutes}
                />
                <Typography>:</Typography>
                <InputBase
                  className={classes.timeInput}
                  type={"number"}
                  size={"small"}
                  onChange={onSecondsChange}
                  value={seconds}
                />
              </Box>
            ) : (
              <Typography>INF</Typography>
            )}
          </Box>
          <Switch onChange={onDurationToggle} checked={hasDuration !== null} />
        </Box>
        <Button
          size="small"
          variant="contained"
          style={style}
          className={classes.save}
          onClick={onDelete}
          disableElevation
        >
          Delete Quiz
        </Button>
        <Button
          size="small"
          variant="contained"
          style={style}
          className={classes.save}
          onClick={onSave}
          disableElevation
        >
          Save Quiz
        </Button>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase
          className={classes.title}
          inputProps={{
            min: 0,
            style: {
              textAlign: "center",
              fontSize: 22,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 10,
            },
          }}
          value={state.quiz_title}
          onChange={onTitleChange}
        />
        <Box className={classes.box}>
          <div className={classes.quizbody} />
          {state.questions &&
            state.questions.map((question, q_key) => (
              <div key={q_key}>
                <Questions
                  q_key={q_key}
                  q_callback={onQuestionChange}
                  q_text={question}
                />
                <Button
                  style={deleteQStyle}
                  variant="contained"
                  onClick={(e) => removeQuestion(e, q_key)}
                  disabled={state.questions.length <= 1}
                  disableElevation
                >
                  X
                </Button>
                {state.answers[q_key].map((ans, a_key) => (
                  <div className={classes.answer} key={a_key}>
                    <Answers
                      a_key={a_key}
                      q_key={q_key}
                      ans_callback={onAnswerChange}
                      ans_text={ans}
                      correct_ans={state.correct_answers[q_key]}
                      disableElevation
                    />
                    {a_key === state.correct_answers[q_key][0] ? (
                      ""
                    ) : (
                      <Button
                        style={correctAnsStyle}
                        variant="contained"
                        onClick={(e) => makeCorrect(e, q_key, a_key)}
                        disableElevation
                      >
                        O
                      </Button>
                    )}
                    <Button
                      style={deleteAnsStyle}
                      variant="contained"
                      onClick={(e) => removeAnswer(e, q_key, a_key)}
                      disabled={state.answers[q_key].length <= 2}
                      disableElevation
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Button
                  style={addAnsStyle}
                  variant="contained"
                  onClick={(e) => addAnswer(e, q_key)}
                  disableElevation
                >
                  + Add answer
                </Button>
              </div>
            ))}
          <Button
            style={addQStyle}
            variant="contained"
            onClick={addQuestion}
            disableElevation
          >
            + Add question
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
}
