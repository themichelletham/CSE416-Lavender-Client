import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, Input } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as constants from '../components/constants';
import Questions from '../components/Questions';
import Answers from '../components/Answers';
import { DoorBack, Login } from '@mui/icons-material';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';


const useStyles = makeStyles((theme) => ({
  QuizContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: theme.spacing(120),
  },
  Opt: {
    display: 'inline-block',
    width: theme.spacing(120),
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
  duration: {
    display: 'inline-block',
    float: 'left',
    fontSize: 16,
    fontWeight: 'bold'
  },
  save: {
    display: 'inline-block',
    float: 'right',
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
    border: 'none',
  },
  quizbody: {
    display: 'flex',
    backgroundColor: "#FFFFFF",
  },
  answer: {
    display: 'flex',
  },
  editThumbnail: {
    display: 'inline-block',
    width: theme.spacing(200),
    paddingLeft: theme.spacing(103),
    zIndex: 'tooltip'
  },
  //toolbar: theme.mixins.toolbar,
}))

export default function QuizCreate(props) {
  const [state, setState] = useState({
    platform_name: '',
    quiz_title: '',
    questions: [],
    answers: [],
    correct_answers: [],
  })
  const [previewSource, setPreviewSource] = useState();

  const copyState = () => {
    let new_title = state.quiz_title;
    let new_questions = [...state.questions];
    let new_answers = state.answers.map((arr) => arr.slice());
    let new_correct_answers = [...state.correct_answers];
    return [new_title, new_questions, new_answers, new_correct_answers];
  }

  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const theme = createTheme();
  theme.spacing(1); // `${8 * 2}px` = '16px'

  const style = {
    backgroundColor: '#ACACE1',
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: 'black'
  }

  const addQStyle = {
    backgroundColor: '#8A8AEE',
    left: theme.spacing(11),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(6),
    color: 'black',
    width: theme.spacing(95),
    borderRadius: 20,
  }

  const addAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(6),
    marginBottom: theme.spacing(2),
    color: 'black',
    float: 'right',
    borderRadius: 20,
  }

  const deleteQStyle = {
    backgroundColor: '#8A8AEE',
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(3),
    float: 'right',
    color: 'black',
    borderRadius: 20
  }

  const deleteAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginTop: theme.spacing(1),
    color: 'black',
    float: 'right',
    borderRadius: 20,
  }

  const correctAnsStyle = {
    backgroundColor: '#8A8AEE',
    marginTop: theme.spacing(1),
    color: 'black',
    float: 'right',
    borderRadius: 20
  }

  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/creator`, {
      quiz_fields: { quiz_name: state.quiz_title, }
    }).then(res => {
      // TODO: DO something after udpate
    }).catch(err => {
      console.log('PUT on Save: ', err);
    })

    var questions_fields = state.questions.map((q) => (
      { quiz_id: props.match.params.quiz_id, question_text: q }
    ));
    var answers_fields = state.answers.map((ans_arr, index) => {
      return ans_arr.map((ans, a_key) => (
        { answer_text: ans, is_correct: state.correct_answers[index][0] === a_key }));
    });

    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/question`, {
      questions_fields: questions_fields,
      answers_fields: answers_fields,
    }).then(res => {
      // TODO: DO something after udpate
    }).catch(err => {
      console.log('PUT on Save: ', err);
    })
  };

  const onDelete = (e) => {
    axios.delete(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then(res => {
        history.goBack()
      }).catch(err => {
        console.log(err);
      })
  }

  const onTitleChange = (e) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    new_title = e.target.value;
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  const onQuestionChange = (e, q_k) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    new_questions[q_k] = e.target.value;
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  const addQuestion = (e) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    new_questions.push('New question');
    new_answers.push(['New Answer', 'New Answer']);
    new_correct_answers.push([0]);
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  const removeQuestion = (e, q_k) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    new_questions.splice(q_k, 1);
    new_answers.splice(q_k, 1);
    new_correct_answers.splice(q_k, 1);
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  const onAnswerChange = (e, q_k, a_k) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    //new_correct_answers[q_k][0] = a_k;
    //if ( new_answers[q_k][a_k] === new_correct_answers[q_k][0]){
    //  new_correct_answers[q_k][0] = e.target.value;
    //}
    new_answers[q_k][a_k] = e.target.value;

    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  const addAnswer = (e, q_k) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    new_answers[q_k].push('New answer');
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  //adds/changes correct answer
  //this list will be used to compare with the other answers in the list to see which is correct
  const makeCorrect = (e, q_k, a_k) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    new_correct_answers[q_k] = [a_k];
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  const removeAnswer = (e, q_k, a_k) => {
    let [new_title, new_questions, new_answers, new_correct_answers] = copyState();
    new_answers[q_k].splice(a_k, 1);
    if (a_k < new_correct_answers[q_k][0]) {
      new_correct_answers[q_k][0]--;
    }
    else if (a_k === new_correct_answers) {
      new_correct_answers[q_k][0] = 0;
    }
    setState({
      quiz_title: new_title,
      questions: new_questions,
      answers: new_answers,
      correct_answers: new_correct_answers,
    });
  }

  const parseToState = (res) => {
    const platform_name = res.data.platform.platform_name;
    const title = res.data.quiz.quiz_name;
    const questions = res.data.questions.map(q_obj => q_obj.question_text)
    const answers = res.data.answers.map(ans_list => (
      ans_list.map(ans_obj => ans_obj.answer_text)
    ));
    const correct_answers = res.data.answers.map(ans_list => {
      const ca = [];
      for (let i = 0; i < ans_list.length; ++i) {
        console.log(ans_list[i]);
        if (ans_list[i].is_correct) {
          ca.push(i);
        }
      }
      console.log(ca);
      //ans_list.filter(ans_obj => ans_obj.is_correct).map(ans_objb => ans_objb.answer_text)
      return ca;
    });
    return { platform_name: platform_name, quiz_title: title, questions: questions, answers: answers, correct_answers: correct_answers };
  }
  useEffect(() => {
    axios.get(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then(res => {
        setState(parseToState(res));
      }).catch(err => {
        console.log(err);
      })
  }, [props]);

  const handleFileInputChange = (e) => {
    const file = (e.target.files[0]);
    if (!file) return;
    previewFile(file);
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    }
  }

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  }

  const uploadImage = async (base64EncodedImage) => {
    console.log(typeof base64EncodedImage);
    console.log(base64EncodedImage);
    if (!base64EncodedImage) {
      return;
    }
    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/image-upload`, {
      quiz_fields: { icon_photo: base64EncodedImage }

    }).then(res => {
      //stuff
      console.log(res);
      console.log("image sent");
      return;
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <Box className={classes.QuizContainer}>
      <h1>{state.platform_name}</h1>
      <img className={classes.icon} src={previewSource} />
      <Box className={classes.editThumbnail}>
        <Input type="file" name="image" accept=".jpg .png .jpeg" multiple={false} onChange={handleFileInputChange}></Input>
        <Button className={classes.thumbnailButton} size='large' onClick={handleSubmitFile} endIcon={<FileUploadIcon />} disableElevation pl={1}>Upload</Button>
      </Box>
      <Box className={classes.Opt} mt={3} >
        <div className={classes.duration}>Duration: INF</div>
        <Button size='small' variant='contained' style={style} className={classes.save} onClick={onDelete} disableElevation>Delete Quiz</Button>
        <Button size='small' variant='contained' style={style} className={classes.save} onClick={onSave} disableElevation>Save Quiz</Button>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase className={classes.title}
          inputProps={{
            min: 0,
            style: {
              textAlign: 'center', fontSize: 22, paddingTop: 0, paddingBottom: 0,
              marginTop: 10
            }
          }}
          value={state.quiz_title}
          onChange={onTitleChange} />
        <Box className={classes.box}>
          <div className={classes.quizbody} />
          {state.questions && state.questions.map((question, q_key) => (
            <div key={q_key}>
              <Questions
                q_key={q_key}
                q_callback={onQuestionChange}
                q_text={question}
              />
              <Button style={deleteQStyle} variant='contained' onClick={e => removeQuestion(e, q_key)} disabled={state.questions.length <= 1} disableElevation>X</Button>
              {state.answers[q_key].map((ans, a_key) => (
                <div className={classes.answer} key={a_key}>
                  <Answers a_key={a_key} q_key={q_key} ans_callback={onAnswerChange} ans_text={ans} correct_ans={state.correct_answers[q_key]} disableElevation />
                  {a_key === state.correct_answers[q_key][0] ? "" : <Button style={correctAnsStyle} variant='contained' onClick={e => makeCorrect(e, q_key, a_key)} disableElevation>O</Button>}
                  <Button style={deleteAnsStyle} variant='contained' onClick={e => removeAnswer(e, q_key, a_key)} disabled={state.answers[q_key].length <= 2} disableElevation>X</Button>
                </div>
              ))}
              <Button style={addAnsStyle} variant='contained' onClick={e => addAnswer(e, q_key)} disableElevation>+ Add answer</Button>
            </div>
          ))}
          <Button style={addQStyle} variant='contained' onClick={addQuestion} disableElevation>+ Add question</Button>
        </Box>
      </FormControl>
    </Box>
  )
}
