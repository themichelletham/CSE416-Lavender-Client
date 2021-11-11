import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import * as constants from '../components/constants';
import { makeStyles } from '@material-ui/core';
import { Box, Button, FormControl, InputBase, Input, Grid } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Switch, useHistory } from 'react-router-dom';
import PlatformProfile from '../components/PlatformProfile.js';
import PlatformLead from "../components/PlatformLead.js";
import { styled } from '@mui/material/styles';
import { createTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { purple } from '@mui/material/colors'
import FileUploadIcon from '@mui/icons-material/FileUpload';

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#7519BD"),
    backgroundColor: "#7519BD",
    "&:hover": {
      backgroundColor: purple[900]
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
  quiz:{ 
    color: "#FFFFFF", 
    width: theme.spacing(15), 
    height: theme.spacing(10), 
    textAlign: 'center', 
  },
  editThumbnail: {
    display: 'inline-block',
    width: theme.spacing(200),
    paddingLeft: theme.spacing(103),
    zIndex: 'tooltip'
  },
}));

export default function PlatformCreator(props) {
  const [state, setState] = useState({
    platform_name: 'Untitled Platform',
    quizzes: [],
  })

  const [fileInputState, setFileInputState] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [previewSource, setPreviewSource] = useState();
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");


  const copyState = () => {
    let new_name = state.platform_name;
    let new_quizzes = [...state.quizzes];
    return [new_name
      , new_quizzes
    ];
  }

  useEffect(() => {
    axios.get(`${constants.API_PATH}/platform/${props.match.params.platform_id}/quizzes`)
    .then( res => {
      console.log(res);
      setState({platform_name: state.platform_name
        , quizzes: res.data
      });
    }).catch( err => {
      console.log(err);
      
    })
  }, []);

  const classes = useStyles();
  const history = useHistory();

  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/platform/${props.match.params.platform_id}/creator`, {
      platform_fields: { platform_name: state.platform_name
        , quizzes: state.quizzes 
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
      history.goBack().goBack();
    }).catch(err => {
      console.log(err);
    })
  }

  const onTitleChange = (e) => {
    let [new_name, new_quizzes] = copyState();
    new_name = e.target.value;
    setState({
      platform_name: new_name,
      quizzes: new_quizzes,
    });
  }

  const parseToState = (res) => {
    const title = res.data.platform_name;
    const quizzes = res.data.quizzes.map(q_obj => q_obj.quiz_name)
    return { platform_name: title
      , quizzes: quizzes
    };
  }

  useEffect(() => {
    if (props.location.state == null) {
      axios.get(`${constants.API_PATH}/platform/${props.match.params.platform_id}`)
        .then(res => {
          console.log(res);
          setState({platform_name: res.data.platform_name,
            quizzes: res.data.quizzes,
         });
        }).catch(err => {
          console.log(err);
        })
    }
    else if (props.location.state) {
      setState({
        platform_name: props.location.state.platform_name,
        quizzes: [],
      });
    }
  }, [props]);

  
  
  const handleFileInputChange = (e) => {
    const file = (e.target.files[0]);
    if (!file) return;
    previewFile(file);
    // const data = new FormData();
    // data.append("file", image);
    // data.append("upload_present", "qoipcud5");
    // data.append("cloud_name", "lavender-sprout-herokuapp-com");
    // fetch("	https://api.cloudinary.com/v1_1/lavender-sprout-herokuapp-com/image/upload", {
    //   method: "post",
    //   body: data
    // })
    // .then(res => res.json())
    // .then(data => {
    //   setUrl(data.url)
    // })
    // .catch( err => console.log(err))
  }

  const previewFile = (file) =>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    }
  }

  const handleSubmitFile = (e) =>{
    e.preventDefault();
    if (!previewSource) return;
    // const reader = new FileReader();
    // reader.readAsDataURL(selectedFile);
    uploadImage(previewSource);
  }

  const uploadImage = async (base64EncodedImage) =>{
    console.log(base64EncodedImage);
    if (base64EncodedImage){
      
    }
    axios.post(`${constants.API_PATH}/image/image-upload`, {
      data: JSON.stringify(base64EncodedImage),  
    }).then(res => {
      //stuff
      console.log(res);
      console.log("image sent");
      return;
    }).catch(err => {
      console.log(err);
    });
    // try {
    //   await fetch ('/image/image-upload',{
    //     method:'POST',
    //     body: JSON.stringify({data: base64EncodedImage}),
    //     headers: {'Content-type': 'applicaiton/json'}
    //   })

    // }catch (error){
    //   console.error(error);
    // }
  }

  const handleImageUpload = (e) => {
    if (!image) {
      return;
    }
    console.log(image);
    
    const data = new FormData();
    data.append("image", image);
    // uploadImage(data)
    // .then(uploadedImage=>{
    //   console.log(uploadedImage)
    // })
    // .catch(_ => {
    //   console.log("image upload went wrong")
    // })
    // data.append("upload_present", "qoipcud5");
    // data.append("cloud_name", "lavender-sprout-herokuapp-com");
    // fetch("	https://api.cloudinary.com/v1_1/lavender-sprout-herokuapp-com/image/upload", {
    //   method: "post",
    //   body: data
    // })
    // .then(res => res.json())
    // .then(data => {
    //   setUrl(data.url)
    // })
    // .catch( err => console.log(err))
  }

  return (
    <Box className={classes.PlatformCreatorContainer}>
      <PlatformProfile/>
      <PlatformLead/>
      <Box className={classes.editThumbnail}>
      <Input type="file" name="image" accept=".jpg .png .jpeg" multiple={false} onChange={handleFileInputChange}></Input>
        <Button className={classes.thumbnailButton} size='large' onClick={handleSubmitFile} endIcon={<FileUploadIcon />} disableElevation pl={1}>Upload</Button>
      </Box>
      {previewSource && (<img src={previewSource} alt="chosen"style={{height: '300px'}} />)}
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
      <Box sx={{display: 'flex',flexWrap: 'wrap', maxWidth: theme.spacing(150)}}>
          <Grid container spacing={8} ml={1}>
            {state.quizzes?state.quizzes.map( quiz => (
              <Grid item className={classes.gridItem}  key={quiz.quiz_id}>
                  <Link to={{pathname: `/quiz/${quiz.quiz_id}`, quiz_id: quiz.quiz_id}}>
                    <ColorButton className={classes.quiz} variant='contained' disableElevation>{quiz.quiz_name}</ColorButton>
                  </Link>
              </Grid>
            )):<Grid item></Grid>}
          </Grid>
        </Box>
    </Box>
  )
}
