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
    width: '100%',
    height: '100%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 1,
    overflowX:"hidden",
    overflowY:"hidden",
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
