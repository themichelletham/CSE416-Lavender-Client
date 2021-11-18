import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../components/Sidebar.js";
import { createTheme } from "@material-ui/core/styles";
import Search from "./Search";

const ttheme = createTheme();
ttheme.spacing(1);

const useStyles = makeStyles((theme) => ({
  homePage: {
    /*display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "90%",
    height: "90%",
    flexGrow: 8,
    left: 10*/
    width: '100%',
    height: '100%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 1,
    //width: theme.spacing(100),
    //height: theme.spacing(100),
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

  useEffect(() => {
    setKeyword(props.keyword);
  }, [props]);

  return (
    <Box className="homePage">
      <Sidebar className={classes.drawer} user_id={props.user_id} platform_id={props.platform_id} />
      <Search keyword={keyword} />
    </Box>
  );
}

export default Home;
