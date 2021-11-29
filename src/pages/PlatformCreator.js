import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as constants from "../components/constants";
import { makeStyles } from "@material-ui/core";
import { Card, CardContent, CardMedia } from "@material-ui/core";
import {
  Box,
  Button,
  FormControl,
  InputBase,
  Input,
  Grid,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PlatformProfile from "../components/PlatformProfile.js";
import PlatformLead from "../components/PlatformLead.js";
import SearchBar from "material-ui-search-bar";
import { styled } from "@mui/material/styles";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { purple, grey } from "@mui/material/colors";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddIcon from "@material-ui/icons/Add";

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ACACE1"),
  backgroundColor: "#ACACE1",
  "&:hover": {
    backgroundColor: "#8A8AEE",
  },
}));

const useStyles = makeStyles((theme) => ({
  PlatformCreatorContainer: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    justifyContent: "flex-start",
    alignItems: "left",
    flexGrow: 1,
    width: "100vw",
    marginLeft: theme.spacing(5),
  },
  container: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    left: 1,
    display: "inline-block",
    width: "100%",
  },
  Opt: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    paddingLeft: "60%",
    //paddingBottom: theme.spacing(0.5),
    alignItems: "left",
  },
  search: {
    //display: 'inline-block',
    border: 1,
    borderColor: grey,
    borderRadius: 30,
    //margin: "auto",
    left: 0,
    marginLeft: "20%",
    width: 600,
    height: 35,
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    //align: "center"
  },
  editPlatform: {
    borderRadius: 15,
    display: "flex",
    flexGrow: 1,
    width: "100%",
    borderTopLeftRadius: 15,
    left: 1,
  },
  title: {
    display: "flex",
    flexGrow: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: theme.spacing(7.5),
    backgroundColor: "#7519BD",
    width: "80vw",
    marginBottom: theme.spacing(2),
  },
  gridContainer: {
    display: "inline-flex",
    padding: theme.spacing(2),
    //paddingLeft: "10%",
    width: "100%",
    flexWrap: "wrap",
    maxWidth: "80vw",
  },
  quiz: {
    color: "#FFFFFF",
    width: theme.spacing(15),
    height: theme.spacing(10),
    textAlign: "center",
  },
  editThumbnail: {
    display: "inline-block",
    width: "100%",
    paddingTop: 1,
    paddingLeft: "55%",
    zIndex: "tooltip",
    flexGrow: 1,
  },
  createQuiz: {
    width: theme.spacing(25),
    height: theme.spacing(15),
  },
  createQuiz: {
    width: theme.spacing(25),
    height: theme.spacing(15),
  },
  card: {
    width: theme.spacing(24),
    height: "100%",
  },
}));

export default function PlatformCreator(props) {
  const [state, setState] = useState({
    platform_name: "Untitled Platform",
    quizzes: [],
    topFiveUsers: [],
  });

  const [selectedQuiz, setSelectedQuiz] = useState();
  const [quizDialog, setQuizDialog] = useState(false);
  const [platformDialog, setPlatformDialog] = useState(false);

  const [previewSource, setPreviewSource] = useState();
  const [image, setImage] = useState("");
  const [banner, setBanner] = useState("");
  const [url, setUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [cloudinaryErr, setCloudinaryErr] = useState("");

  const copyState = () => {
    let ret = {};
    ret.platform_name = state.platform_name;
    ret.quizzes = state.quizzes.length ? [...state.quizzes] : [];
    ret.topFiveUsers = state.quizzes.length ? [...state.topFiveUsers] : [];
    return ret;
  };

  const classes = useStyles();
  const history = useHistory();

  const onSave = (e) => {
    axios
      .put(
        `${constants.API_PATH}/platform/${props.match.params.platform_id}/creator`,
        {
          platform_fields: {
            platform_name: state.platform_name,
            quizzes: state.quizzes,
          },
        }
      )
      .then((res) => {
        // TODO: DO something after udpate
      })
      .catch((err) => {
        console.log("PUT on Save: ", err);
      });
    uploadImage();
  };

  const onDelete = (e) => {
    axios
      .delete(
        `${constants.API_PATH}/platform/${props.match.params.platform_id}`
      )
      .then((res) => {
        // Go to Home Page
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeletePlatformOpen = (e) => {
    setPlatformDialog(true);
  };

  const handleDeletePlatformClose = (e) => {
    setPlatformDialog(false);
  };

  const onTitleChange = (e) => {
    let new_state = copyState();
    new_state.platform_name = e.target.value;
    setState(new_state);
  };

  const fetchPlatformData = (keyword) => {
    axios
      .get(`${constants.API_PATH}/platform/${props.match.params.platform_id}`, {
        params: {
          keyword: keyword,
        },
      })
      .then((res) => {
        setState({
          platform_name: res.data.platform_name,
          quizzes: res.data.quizzes,
          topFiveUsers: res.data.topFiveUsers,
        });
        setUrl(res.data.icon_photo);
        setBannerUrl(res.data.banner_photo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const search = (e) => {
    if (e.key === "Enter") {
      fetchPlatformData(e.target.value);
    }
  };

  useEffect(() => {
    fetchPlatformData("");
  }, [props]);

  const onCreateQuiz = (e) => {
    e.preventDefault();
    axios
      .post(
        `${constants.API_PATH}/quiz`,
        {
          quiz_fields: {
            platform_id: props.match.params.platform_id,
            quiz_name: "Untitled",
            time_limit: null,
          },
          user_id: props.user_id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          history.push(`/quiz/${res.data.quiz.quiz_id}/creator`);
        }
      })
      .catch((err) => {
        console.log("Create Quiz Button: ", err);
      });
  };

  const onDeleteQuiz = (e, index) => {
    e.preventDefault();
    console.log(`Deleting Quiz index ${index}`);
    let new_state = copyState();
    axios
      .delete(`${constants.API_PATH}/quiz/${state.quizzes[index].quiz_id}`)
      .then((res) => {
        console.log(res);
        new_state.quizzes.splice(index, 1);

        setState(new_state);
        setQuizDialog(false);
        setSelectedQuiz(null);

        console.log(`deleted quiz ${state.quizzes[index].quiz_id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteQuizOpen = (index) => {
    // console.log(state);
    // console.log(`trying to delete quiz ${index}`);

    setSelectedQuiz(index);
    setQuizDialog(true);
    // console.log("delete dialog opened");
  };

  const handleDeleteQuizClose = () => {
    setQuizDialog(false);
    setSelectedQuiz(null);
    // console.log("delete dialog closed");
  };

  const handleFileInputChange = (e, imagetype) => {
    const file = e.target.files[0];
    if (!file) return;
    if (imagetype === "icon") {
      setImage(file);
    } else {
      setBanner(file);
    }
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const uploadImages = () => {
    imageDetails(image, "icon");
    imageDetails(banner, "banner");
  };
  const imageDetails = (new_photo, imagetype) => {
    const data = new FormData();
    data.append("file", new_photo);
    data.append("upload_preset", "sprout");
    data.append("cloud_name", "lavender-sprout-herokuapp-com");

    //please note: Maximum file size is 10485760, may want to display this
    fetch(
      `https://api.cloudinary.com/v1_1/lavender-sprout-herokuapp-com/image/upload`,
      {
        method: "post",
        body: data,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (imagetype === "icon") {
          setUrl(data.url);
        } else {
          setBannerUrl(data.url);
        }
        setCloudinaryErr("");
      })
      .catch((err) => {
        console.log(err);
        setCloudinaryErr(err.message);
      });
  };

  const uploadImage = () => {
    console.log(url);
    axios
      .put(
        `${constants.API_PATH}/platform/${props.match.params.platform_id}/image-upload`,
        {
          platform_fields: {
            icon_photo: url,
            banner_photo: bannerUrl,
          },
        }
      )
      .then((res) => {
        //stuff
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box className={classes.PlatformCreatorContainer}>
      <PlatformProfile platform_icon={url} banner={bannerUrl} />
      <PlatformLead topFiveUsers={state.topFiveUsers} />
      <Box className={classes.container}>
        <Box className={classes.editThumbnail}>
          Banner photo:
          <Input
            type="file"
            name="image"
            accept=".jpg .png .jpeg"
            multiple={false}
            onChange={(e) => handleFileInputChange(e, "banner")}
          ></Input>
          <br></br>Icon photo:
          <Input
            type="file"
            name="image"
            accept=".jpg .png .jpeg"
            multiple={false}
            onChange={(e) => handleFileInputChange(e, "icon")}
          ></Input>
          {cloudinaryErr}
          <Button
            className={classes.thumbnailButton}
            size="large"
            onClick={uploadImages}
            endIcon={<FileUploadIcon />}
            disableElevation
            pl={1}
          >
            Upload
          </Button>
        </Box>
        <SearchBar
          className={classes.search}
          placeholder="Search..."
          onKeyPress={search}
        />
        <Box className={classes.Opt} ml={3} mr={1} mt={3}>
          <Button
            size="small"
            variant="contained"
            onClick={onSave}
            disableElevation
          >
            Save Platform
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              handleDeletePlatformOpen();
            }}
            disableElevation
          >
            Delete Platform
          </Button>
        </Box>
        <Dialog open={platformDialog} onClose={handleDeletePlatformClose}>
          <DialogTitle>Delete Platform {state.platform_name}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this platform?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeletePlatformClose}>No</Button>
            <Button
              onClick={(e) => {
                onDelete();
              }}
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
        <FormControl className={classes.editPlatform}>
          <InputBase
            className={classes.title}
            inputProps={{
              min: 800,
              style: {
                textAlign: "center",
                fontSize: 22,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 10,
                fullWidth: "true",
              },
            }}
            value={state.platform_name}
            onChange={onTitleChange}
          />
        </FormControl>
        <Box>
          <Grid container spacing={3} className={classes.gridContainer}>
            {props.user_id ? (
              <Grid item className={classes.gridItem} key={"Create quiz"}>
                <ColorButton
                  className={classes.createQuiz}
                  onClick={onCreateQuiz}
                  endIcon={<AddIcon />}
                >
                  Create Quiz
                </ColorButton>
              </Grid>
            ) : (
              <></>
            )}
            {state.quizzes ? (
              state.quizzes.map((quiz, index) => (
                <Grid item className={classes.gridItem} key={index}>
                  <Card className={classes.card}>
                    <Link
                      to={{
                        pathname: `/quiz/${quiz.quiz_id}/creator`,
                        quiz_id: quiz.quiz_id,
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        width="200"
                        image={quiz.icon_photo}
                      />
                      <CardContent>{quiz.quiz_name}</CardContent>
                    </Link>
                    <Button
                      onClick={(e) => {
                        handleDeleteQuizOpen(index);
                      }}
                    >
                      <HighlightOffIcon style={{ fill: "red" }} />
                      Delete Quiz
                    </Button>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item></Grid>
            )}
          </Grid>
        </Box>
        <Dialog open={quizDialog} onClose={handleDeleteQuizClose}>
          <DialogTitle>Delete Quiz</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this quiz?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteQuizClose}>No</Button>
            <Button
              onClick={(e) => {
                onDeleteQuiz(e, selectedQuiz);
              }}
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
