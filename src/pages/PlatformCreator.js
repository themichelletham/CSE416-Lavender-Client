import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import * as constants from "../components/constants";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import { Card, CardContent, CardMedia } from "@material-ui/core";
import {
  Box,
  Button,
  FormControl,
  InputBase,
  Input,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Link,
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
import { createTheme } from "@material-ui/core/styles";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddIcon from "@material-ui/icons/Add";
import Banner from "../images/banner.png";

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#ACACE1"),
  backgroundColor: "#ACACE1",
  "&:hover": {
    backgroundColor: "#8A8AEE",
  },
}));

const InputButton = styled("input")({
  backgroundColor: "#8A8AEE",
  "&:hover": {
    backgroundColor: "#7373DF",
  },
});

const useStyles = makeStyles((theme) => ({
  PlatformCreatorContainer: {
    width: '100%',
    height: '100%',
    display: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    overflowX:"hidden",
    overflowY:"hidden"
  },
  hContainer: {
    display: "flex",
    flexDirection: "row",
    //width: "90%",
    flexGrow: 1,
    justifyContent: "center",
    marginLeft: "5%"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  container: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    //left: 1,
    display: "inline-block",
    borderRight: "0.2em solid #dcdce3",
  },
  Opt: {
    /*display: "flex",
    flexGrow: 1,
    paddingLeft: "71%",
    alignItems: "left",*/
    width: "100%", 
    paddingLeft: "71%",
    marginBottom: theme.spacing(0.1),
  },
  header: {
    display: "flex",
    flexDirection: "row",
    width: "98%",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderBottom: "0.2em solid #dcdce3",
  },
  search: {
    border: 1,
    borderColor: grey,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    width: "60%",
    height: 35,
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
    backgroundColor: "#8E71DF",
    width: "75vw",
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(3),
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
    marginLeft: "60%",
    paddingBottom: 1,
    //paddingLeft: "60%",
    //zIndex: "tooltip",
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

const style = {
  backgroundColor: "#ACACE1",
  marginLeft: theme.spacing(0.5),
  marginBottom: theme.spacing(0.1),
  color: "black",
};

export default function PlatformCreator(props) {
  const [redirect, setRedirect] = useState(false);
  const [state, setState] = useState({
    platform_name: "Untitled Platform",
    user_id: null,
    quizzes: [],
    topFiveUsers: [],
    sortBy: "dd",
  });

  const [selectedQuiz, setSelectedQuiz] = useState();
  const [quizDialog, setQuizDialog] = useState(false);
  const [platformDialog, setPlatformDialog] = useState(false);

  const [tempImage, setTempImage] = useState("");
  const [tempBanner, setTempBanner] = useState("");
  const [url, setUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [cloudinaryErr, setCloudinaryErr] = useState("");

  const copyState = () => {
    let ret = {};
    ret.platform_name = state.platform_name;
    ret.user_id = state.user_id;
    ret.quizzes = state.quizzes.length ? [...state.quizzes] : [];
    ret.topFiveUsers = state.quizzes.length ? [...state.topFiveUsers] : [];
    ret.sortBy = state.sortBy;
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
            icon_photo: url === "" ? tempImage : url,
            banner_photo: bannerUrl === "" ? tempBanner : bannerUrl,
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
  };

  const onDelete = (e) => {
    axios
      .delete(
        `${constants.API_PATH}/platform/${props.match.params.platform_id}`
      )
      .then((res) => {
        // Go to Home Page
        props.onDeletePlatformCallback();
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
      .get(
        `${constants.API_PATH}/platform/${props.match.params.platform_id}/creator`,
        {
          params: {
            keyword: keyword,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setState({
          platform_name: res.data.platform_name,
          user_id: res.data.user_id,
          quizzes: res.data.quizzes,
          topFiveUsers: res.data.topFiveUsers,
          sortBy: "dd",
        });
        //setUrl(res.data.icon_photo);
        //setBannerUrl(res.data.banner_photo);
        setTempImage(res.data.icon_photo);
        setTempBanner(res.data.banner_photo);
      })
      .catch((err) => {
        console.log(err);
        setRedirect(true);
      });
  };

  const search = (e) => {
    if (e.key === "Enter") {
      fetchPlatformData(e.target.value);
    }
  };

  const sortQuizzes = (e) => {
    const new_state = copyState();
    new_state.sortBy = e.target.value;
    new_state.quizzes.sort((f, s) => {
      if (new_state.sortBy === "dd") return f.createdAt < s.createdAt;
      if (new_state.sortBy === "da") return f.createdAt > s.createdAt;
      return f.quiz_name > s.quiz_name;
    });
    setState(new_state);
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
            is_published: false,
          },
        },
        { withCredentials: true }
      )
      .then((res) => {
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
    let new_state = copyState();
    axios
      .delete(`${constants.API_PATH}/quiz/${state.quizzes[index].quiz_id}`)
      .then((res) => {
        new_state.quizzes.splice(index, 1);

        setState(new_state);
        setQuizDialog(false);
        setSelectedQuiz(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteQuizOpen = (index) => {
    setSelectedQuiz(index);
    setQuizDialog(true);
  };

  const handleDeleteQuizClose = () => {
    setQuizDialog(false);
    setSelectedQuiz(null);
  };

  const handleVisibility = (index) => {
    let new_state = copyState();
    new_state.quizzes[index].is_published =
      !new_state.quizzes[index].is_published;
    setState(new_state);
    axios
      .put(`${constants.API_PATH}/quiz/toggle_publish/`, {
        quiz_fields: {
          quizzes: new_state.quizzes[index],
        },
      })
      .then((res) => {
        // updated
      })
      .catch((err) => {
        console.log("PUT on Save Quizzes: ", err);
      });
  };

  const handleFileInputChange = (e, imagetype) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 10485760) {
      setCloudinaryErr(
        "File size too large for " + imagetype + "Max file size: 10485760 bytes"
      );
      return;
    }
    setCloudinaryErr("");

    previewFile(file, imagetype);
  };

  const previewFile = (file, imagetype) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    if (imagetype === "icon") {
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
    } else {
      reader.onloadend = () => {
        setTempBanner(reader.result);
      };
    }
    // uploadImages();
  };

  const uploadImages = () => {
    imageDetails(tempImage, "icon");
    imageDetails(tempBanner, "banner");
  };

  //https://www.youtube.com/watch?v=uP568vOaBbQ
  const imageDetails = async (new_photo, imagetype) => {
    if (new_photo !== "") {
      const data = new FormData();
      data.append("file", new_photo);
      data.append("upload_preset", "sprout");
      data.append("cloud_name", "di6unfiu0");

      //please note: Maximum file size is 10485760, may want to display this
      await fetch(`https://api.cloudinary.com/v1_1/di6unfiu0/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (imagetype === "icon") {
            setUrl(data.url);
          } else {
            setBannerUrl(data.url);
          }
        })
        .catch((err) => {
          console.log("error");
        });
    }
  };

  return redirect ? (
    <Redirect to={`/platform/${props.match.params.platform_id}`} />
  ) : (
    <Box className={classes.PlatformCreatorContainer}>
      <PlatformProfile
        platform_icon={url === "" ? tempImage : url}
        banner={bannerUrl === "" ? tempBanner : bannerUrl}
      />
      <Box className={classes.hContainer}>
        <Box className={classes.container}>
          <Box className={classes.editThumbnail}>
            Banner:
            <Input
              size="small"
              type="file"
              name="image"
              accept="image/*"
              multiple={false}
              onChange={(e) => handleFileInputChange(e, "banner")}
            ></Input>
            <br></br>Icon:
            <Input
              size="small"
              type="file"
              name="image"
              accept="image/*"
              multiple={false}
              onChange={(e) => handleFileInputChange(e, "icon")}
            ></Input>
            {cloudinaryErr !== "" ? (
              <Alert severity="error">{cloudinaryErr}</Alert>
            ) : (
              <></>
            )}
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
          <Box className={classes.header}>
            <SearchBar
              className={classes.search}
              placeholder="Search..."
              onKeyPress={search}
            />
            <Select
              label="Sort By"
              value={state.sortBy}
              autoWidth
              size="small"
              onChange={sortQuizzes}
            >
              <MenuItem value="da">Date Oldest</MenuItem>
              <MenuItem value="dd">Date Newest</MenuItem>
              <MenuItem value="t">Title</MenuItem>
            </Select>
          </Box>
          <Box className={classes.Opt} ml={3} mr={1} mt={3}>
            <ColorButton
              size="small"
              variant="contained"
              style={style}
              onClick={onSave}
              disableElevation
            >
              Save Platform
            </ColorButton>
            <ColorButton
              size="small"
              style={style}
              variant="contained"
              onClick={(e) => {
                handleDeletePlatformOpen();
              }}
              disableElevation
            >
              Delete Platform
            </ColorButton>
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
                          image={
                            (quiz.icon_photo === "") |
                            (quiz.icon_photo === null)
                              ? Banner
                              : quiz.icon_photo
                          }
                        />
                        <CardContent>{quiz.quiz_name}</CardContent>
                      </Link>
                      {quiz.is_published ? (
                        <Tooltip title="Make Private">
                          <IconButton
                            onClick={(e) => {
                              handleVisibility(index);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Make Public">
                          <IconButton
                            onClick={(e) => {
                              handleVisibility(index);
                            }}
                          >
                            <VisibilityOffIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete Quiz">
                        <IconButton
                          onClick={(e) => {
                            handleDeleteQuizOpen(index);
                          }}
                        >
                          <HighlightOffIcon style={{ fill: "red" }} />
                        </IconButton>
                      </Tooltip>
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
        <PlatformLead topFiveUsers={state.topFiveUsers} />
      </Box>
    </Box>
  );
}
