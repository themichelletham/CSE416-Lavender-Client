import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Box, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/Sidebar.js";
import * as constants from "../components/constants";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Search from "./Search";

const ttheme = createTheme();
ttheme.spacing(1);

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 1,
    width: theme.spacing(100),
    height: theme.spacing(100),
  },
  gridContainer: {
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(20),
    width: theme.spacing(155),
  },
  gridItem: {
    display: "inline-block",
  },
}));

function Home(props) {
  const [keyword, setKeyword] = useState("");
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    console.log("home pageee");
    console.log(props.keyword);
    setKeyword(props.keyword);
  }, []);

  return (
    <Box className="homePage">
      <Sidebar className={classes.drawer} user_id={props.user_id} />
      <Search keyword={keyword} />
    </Box>
  );
}

export default Home;
