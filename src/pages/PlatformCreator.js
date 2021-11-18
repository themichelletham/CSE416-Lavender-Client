import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import * as constants from '../components/constants';
import { makeStyles } from '@material-ui/core';
import { Card, CardContent, CardMedia } from '@material-ui/core';
import { Box, Button, FormControl, InputBase, Input, Grid } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from 'react-router-dom';
import PlatformProfile from '../components/PlatformProfile.js';
import PlatformLead from "../components/PlatformLead.js";
import { styled } from '@mui/material/styles';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddIcon from '@material-ui/icons/Add'

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ACACE1"),
  backgroundColor: "#ACACE1",
  "&:hover": {
    backgroundColor: "#8A8AEE"
  }
}));

const useStyles = makeStyles((theme) => ({
  PlatformCreatorContainer: {
    display: "flex",
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'left',
    flexGrow: 1,
    width: theme.spacing(130),
    marginLeft: theme.spacing(5),
  },
  Opt: {
    display: 'inline-block',
    width: theme.spacing(160),
    paddingLeft: theme.spacing(115),
    paddingBottom: theme.spacing(.5),
    alignItems: 'left',
  },
  editPlatform: {
    borderRadius: 15,
    borderTopLeftRadius: 15,
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: theme.spacing(7.5),
    backgroundColor: "#7519BD",
    width: theme.spacing(155),
    marginBottom: theme.spacing(2),
  },
  quiz: {
    color: "#FFFFFF",
    width: theme.spacing(15),
    height: theme.spacing(10),
    textAlign: 'center',
  },
  editThumbnail: {
    display: 'inline-block',
    width: theme.spacing(200),
    paddingLeft: theme.spacing(117),
    zIndex: 'tooltip'
  },
  createQuiz: { 
    width: theme.spacing(25), 
    height: theme.spacing(15)
  }
}));

export default function PlatformCreator(props) {
  const [state, setState] = useState({
    platform_name: 'Untitled Platform',
    quizzes: [],
    previewSource: '',
    selectedQuiz: null,
    deleteQuizDialog: false,
  })

  const [previewSource, setPreviewSource] = useState();
  const [selectedQuiz, setSelectedQuiz] = useState();
  const [open, setOpen] = useState(false);

  const copyState = () => {
    let new_name = state.platform_name;
    let new_quizzes = [...state.quizzes];
    let new_previewSource = state.previewSource;
    let new_selectedQuiz = state.selectedQuiz;
    let new_deleteQuizDialog = state.deleteQuizDialog;
    return [new_name, new_quizzes, new_previewSource, new_selectedQuiz, new_deleteQuizDialog];
  }

  const classes = useStyles();
  const history = useHistory();

  const onSave = (e) => {
    handleSubmitFile();

    axios.put(`${constants.API_PATH}/platform/${props.match.params.platform_id}/creator`, {
      platform_fields: {
        platform_name: state.platform_name,
        quizzes: state.quizzes
      }
    }).then(res => {
      // TODO: DO something after udpate
    }).catch(err => {
      console.log('PUT on Save: ', err);
    })
  }

  const onDelete = (e) => {
    axios.delete(`${constants.API_PATH}/platform/${props.match.params.platform_id}`)
      .then(res => {
        console.log("platform deleted")
        history.push('/')
      }).catch(err => {
        console.log(err);
      })
  }

  const onTitleChange = (e) => {
    let [new_name, new_quizzes, new_previewSource, new_selectedQuiz, new_deleteQuizDialog] = copyState();
    new_name = e.target.value;
    new_selectedQuiz = null;
    new_deleteQuizDialog = false;
    setState({
      platform_name: new_name,
      quizzes: new_quizzes,
      previewSource: new_previewSource,
      selectedQuiz: new_selectedQuiz,
      deleteQuizDialog: new_deleteQuizDialog,
    });
  }

  useEffect(() => {
    if (props.location.state == null) {
      axios.get(`${constants.API_PATH}/platform/${props.match.params.platform_id}`)
        .then(res => {
          console.log(res);
          setState({
            platform_name: res.data.platform_name,
            quizzes: res.data.quizzes,
            previewSource: res.data.icon_photo,
            selectedQuiz: null,
            deleteQuizDialog: false,
          });
        }).catch(err => {
          console.log(err);
        })
      console.log(state.previewSource);
    }
    else if (props.location.state) {
      setState({
        platform_name: props.location.state.platform_name,
        quizzes: [],
        previewSource: '',
        selectedQuiz: null,
        deleteQuizDialog: false,
      });
    }
  }, [props]);

  const onCreateQuiz = (e) => {
    e.preventDefault();
    axios.post(`${constants.API_PATH}/quiz`, {
      quiz_fields: {
        platform_id: props.match.params.platform_id,
        quiz_name: 'Untitled',
        time_limit: null
      },
      user_id: props.user_id
    }, { withCredentials: true }).then(res => {
      console.log(res)
      if (res.status == 201) {
        history.push(`/quiz/${res.data.quiz.quiz_id}/creator`);
      }
    }).catch(err => {
      console.log('Create Quiz Button: ', err);
    })
  }

  const onDeleteQuiz = (quiz_id) => {
    console.log(`Delete Quiz #${quiz_id}`);
    let [new_platform_name, new_quizzes, new_previewSource, new_selectedQuiz, new_deleteQuizDialog] = copyState();
    axios.delete(`${constants.API_PATH}/quiz/${quiz_id}`)
    .then(res => {
      console.log(res);
      new_quizzes.splice(quiz_id, 1);
      new_selectedQuiz = null;
      new_deleteQuizDialog = false;
      setState({
        platform_name: new_platform_name,
        quizzes: new_quizzes,
        previewSource: new_previewSource,
        selectedQuiz: new_selectedQuiz,
        deleteQuizDialog: new_deleteQuizDialog,
      })
      console.log(`deleted quiz ${quiz_id}`)
    })
    .catch(err => {
      console.log(err);
    })
  }

  const handleDeleteOpen = (e, quiz_id) => {
    console.log(`trying to delete quiz ${quiz_id}`)
    let [new_platform_name, new_quizzes, new_previewSource, new_selectedQuiz, new_deleteQuizDialog] = copyState();
    new_selectedQuiz = quiz_id;
    new_deleteQuizDialog = true;
    setState({
      platform_name: new_platform_name,
      quizzes: new_quizzes,
      previewSource: new_previewSource,
      selectedQuiz: new_selectedQuiz,
      deleteQuizDialog: new_deleteQuizDialog,
    });
    console.log("delete dialog opened")
  }

  const handleDeleteClose = () => {
    let [new_platform_name, new_quizzes, new_previewSource, new_selectedQuiz, new_deleteQuizDialog] = copyState();
    new_selectedQuiz = null;
    new_deleteQuizDialog = false;
    setState({
      platform_name: new_platform_name,
      quizzes: new_quizzes,
      previewSource: new_previewSource,
      selectedQuiz: new_selectedQuiz,
      deleteQuizDialog: new_deleteQuizDialog,
    });
    console.log("delete dialog closed")
  }

  const handleFileInputChange = (e) => {
    const file = (e.target.files[0]);
    if (!file) return;
    previewFile(file);
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let [new_platform_name, new_quizzes, new_previewSource, new_selectedQuiz, new_deleteQuizDialog] = copyState();
      new_previewSource = reader.result;
      setState({
        platform_name: new_platform_name,
        quizzes: new_quizzes,
        previewSource: new_previewSource,
        selectedQuiz: new_selectedQuiz,
        deleteQuizDialog: new_deleteQuizDialog,
      });
    }
  }

  const handleSubmitFile = () => {
    if (!state.previewSource) return;
    uploadImage(state.previewSource);
  }

  const uploadImage = async (base64EncodedImage) => {
    console.log(typeof base64EncodedImage);
    console.log(base64EncodedImage);
    if (!base64EncodedImage) {
      return;
    }
    axios.put(`${constants.API_PATH}/platform/${props.match.params.platform_id}/image-upload`, {
      platform_fields: {
        icon_photo: base64EncodedImage,
      }
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
    <Box className={classes.PlatformCreatorContainer}>
      <PlatformProfile platform_icon={previewSource} />
      <PlatformLead platform_id={props.match.params.platform_id}/>
      <Box className={classes.editThumbnail}>
        <Input type="file" name="image" accept=".jpg .png .jpeg" multiple={false} onChange={handleFileInputChange}></Input>
        {/* <Button className={classes.thumbnailButton} size='large' onClick={handleSubmitFile} endIcon={<FileUploadIcon />} disableElevation pl={1}>Upload</Button> */}
      </Box>
      {/* {previewSource && (<img src={previewSource} alt="chosen"style={{height: '300px'}} />)} */}
      <Box className={classes.Opt} ml={3} mr={1} mt={3}>
        <Button size='small' variant='contained' onClick={onSave} disableElevation>Save Platform</Button>
        <Button size='small' variant='contained' onClick={onDelete} disableElevation>Delete Platform</Button>
      </Box>
      <FormControl className={classes.editPlatform}>
        <InputBase className={classes.title}
          inputProps={{
            min: 0,
            style: {
              textAlign: 'center', fontSize: 22, paddingTop: 0, paddingBottom: 0,
              marginTop: 10,
            }
          }}
          value={state.platform_name}
          onChange={onTitleChange}
        />
      </FormControl>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', maxWidth: theme.spacing(150) }}>
        <Grid container spacing={3} ml={1} mt={1}>
          {props.user_id ?
            (<Grid item className={classes.gridItem} key={'Create quiz'}>
              <ColorButton className={classes.createQuiz} onClick={onCreateQuiz} endIcon={<AddIcon />}>Create Quiz</ColorButton>
            </Grid>) : <></>}
          {state.quizzes ? state.quizzes.map(quiz => (
            <Grid item className={classes.gridItem} key={quiz.quiz_id}>
              <Card>
                <Link to={{ pathname: `/quiz/${quiz.quiz_id}/creator`, quiz_id: quiz.quiz_id }}>
                  <CardMedia component="img" height="140" width="200" image={quiz.icon_photo} />
                  <CardContent>
                    {quiz.quiz_name}
                  </CardContent>
                </Link>
                <Button onClick={(e) => {handleDeleteOpen(quiz.quiz_id)}}>
                  <HighlightOffIcon style={{fill: "red"}}/>
                  Delete Quiz
                </Button>
                {/* <Button onClick={e => onDeleteQuiz(e, quiz.quiz_id)}><HighlightOffIcon style={{fill: "red"}}/>Delete Quiz {quiz.quiz_id}</Button> */}
              </Card>
            </Grid>
          )) : <Grid item></Grid>}
        </Grid>
        <Dialog open={state.deleteQuizDialog} onClose={handleDeleteClose}>
          <DialogTitle>Delete Quiz {state.selectedQuiz}</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this quiz?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>No</Button>
            <Button >Yes, Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
