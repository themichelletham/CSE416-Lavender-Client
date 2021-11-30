import { Button, Card, CardContent, CardMedia } from "@material-ui/core";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Box, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import * as constants from "../components/constants";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PlatformLead from "../components/PlatformLead.js";
import PlatformCreator from "./PlatformCreator.js";
import PlatformProfile from "../components/PlatformProfile.js";
import { createTheme } from "@material-ui/core/styles";
import SearchBar from "material-ui-search-bar";
import { styled } from "@mui/material/styles";
import { purple, grey } from "@mui/material/colors";

const ttheme = createTheme();
ttheme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#7519BD"),
  backgroundColor: "#7519BD",
  "&:hover": {
    backgroundColor: purple[900],
  },
}));

const useStyles = makeStyles((theme) => ({
  PlatformContainer: {
    display: "flex",
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  hContainer: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderBottom: "0.2em solid #dcdce3",
  },
  container: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    left: 1,
    display: "inline-block",
    borderRight: "0.2em solid #dcdce3",
  },
  gridContainer: {
    display: "inline-flex",
    padding: ttheme.spacing(2),
    paddingLeft: "5%",
    marginBottom: ttheme.spacing(40),
    marginLeft: ttheme.spacing(20),
    flexWrap: "wrap",
    maxWidth: "80vw",
  },
  gridItem: {
    display: "inline-block",
    marginBottom: ttheme.spacing(1),
  },
  editPlat: {
    marginLeft: "73%",
  },
  search: {
    border: 1,
    borderColor: grey,
    borderRadius: 30,
    marginLeft: 30,
    marginRight: 30,
    width: "60%",
    height: 35,
  },
  card: {
    width: ttheme.spacing(24),
    height: "100%",
  },
}));

export default function Platform(props) {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    platform_name: "Untitled Platform",
    quizzes: [],
    topFiveUsers: [],
    sortBy: "dd",
  });
  const [previewSource, setPreviewSource] = useState();
  const [bannerUrl, setBannerUrl] = useState("");

  const copyState = () => {
    let new_name = state.platform_name;
    let new_quizzes = [...state.quizzes];
    let new_topFiveUsers = [...state.topFiveUsers];
    return {
      platform_name: new_name,
      quizzes: new_quizzes,
      topFiveUsers: new_topFiveUsers,
      sortBy: state.sortBy,
    };
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
          sortBy: "dd",
        });
        setPreviewSource(res.data.icon_photo);
        setBannerUrl(res.data.banner_photo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const search = (e) => {
    if (e.key == "Enter") {
      fetchPlatformData(e.target.value);
    }
  };

  const sortQuizzes = (e) => {
    const new_state = copyState();
    new_state.sortBy = e.target.value;
    new_state.quizzes.sort((f, s) => {
      if (new_state.sortBy === "dd") return f.createdAt < s.createdAt;
      if (new_state.sortBy === "da") return f.createdAt > s.createdAt;
      return f.title < s.title;
    });
    setState(new_state);
  };
  useEffect(() => {
    //console.log(props.user_id)
    fetchPlatformData("");
  }, []);

  return (
    <Box className={classes.PlatformContainer}>
      <PlatformProfile
        platform_name={state.platform_name}
        platform_icon={previewSource}
        banner={bannerUrl}
      />
      <Box className={classes.hContainer}>
        <Box container className={classes.container}>
          <Box className={classes.header}>
            <Typography variant="h4">Quizzes</Typography>
            <SearchBar
              className={classes.search}
              placeholder="Search..."
              onKeyPress={search}
            />
            <Select
              label="Sort By"
              value={state.sortBy}
              autoWidth
              onChange={sortQuizzes}
            >
              <MenuItem value="da">Date Oldest</MenuItem>
              <MenuItem value="dd">Date Newest</MenuItem>
              <MenuItem value="t">Title</MenuItem>
            </Select>
            <Link to={`/platform/${props.match.params.platform_id}/creator`}>
              <ColorButton>Edit Platform</ColorButton>
            </Link>
          </Box>
          {/* {previewSource && (<img src={previewSource} alt="chosen"style={{height: '300px'}} />)} */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexGrow: 1,
            }}
          ></Box>
          <Box mt={2}>
            <Grid container spacing={3} className={classes.gridContainer}>
              {state.quizzes ? (
                state.quizzes.map((quiz) =>
                  quiz.is_published ? (
                    <Grid
                      item
                      className={classes.gridItem}
                      key={quiz.quiz_id}
                      xs={3}
                      md={3}
                    >
                      <Link
                        to={{
                          pathname: `/quiz/${quiz.quiz_id}`,
                          quiz_id: quiz.quiz_id,
                        }}
                      >
                        <Card className={classes.card}>
                          <CardMedia
                            component="img"
                            height="140"
                            width="200"
                            image={quiz.icon_photo}
                          />
                          <CardContent className={classes.quiz}>
                            {quiz.quiz_name}
                          </CardContent>
                        </Card>
                      </Link>
                    </Grid>
                  ) : (
                    <></>
                  )
                )
              ) : (
                <Grid item></Grid>
              )}
            </Grid>
          </Box>
        </Box>
        <PlatformLead topFiveUsers={[...state.topFiveUsers]} />
      </Box>
    </Box>
  );
}
