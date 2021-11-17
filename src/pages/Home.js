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
    justifyContent: "flex-start",
    width: "80vw",
    height: "80vh",
    flexGrow: 1,
    //width: '100%',
    //height: '100%',
  },
  gridContainer: {
    //marginTop: '2%',
    //marginLeft: '10%',
    //width: '90%',
    //display: 'absolute',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginLeft: "5%",
    width: "80vw",
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
