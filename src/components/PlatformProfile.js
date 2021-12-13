import React from "react";
import Box from "@mui/material/Box";
import Banner from "../images/banner.png";
import defaultIcon from "../images/platformicon.jpeg";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'

const useStyles = makeStyles((theme) => ({
  PlatformProfileContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    flexGrow: 1,
    marginBottom: -theme.spacing(11),
  },
  bannerContainer: {
    display: "flex",
    width: "100%",
    //height: '30vh',
    height: theme.spacing(35),
    background: "black",
  },
  banner: {
    width: "100%",
    //height: '30vh',
    height: theme.spacing(35),
    overflow: "hidden",
    zIndex: "modal",
  },
  headerContainer: {
    display: "flex",
    position: "relative",
    top: -theme.spacing(11),
    left: 0,
    float: "left",
    width: "80%",
    zIndex: "tooltip",
  },
  icon: {
    position: "relative",
    top: 0,
    left: 0,
    //float: 'left',
    height: theme.spacing(22),
    width: theme.spacing(22),
    borderRadius: "100%",
    zIndex: "tooltip",
  },
  title: {
    display: "flex",
    position: "relative",
    left: 0,
    top: theme.spacing(11),
  },
}));

export default function PlatformProfile(props) {
  const classes = useStyles();
  return (
    <Box className={classes.PlatformProfileContainer}>
      <Box className={classes.bannerContainer}>
        <img
          className={classes.banner}
          src={
            props.banner === "" || props.banner === null ? Banner : props.banner
          }
          alt={Banner}
        />
      </Box>
      <Box className={classes.headerContainer}>
        <img
          className={classes.icon}
          src={
            props.platform_icon === "" || props.platform_icon === null
              ? defaultIcon
              : props.platform_icon
          }
          alt={defaultIcon}
        />
        <Typography variant="h4" ml={2} mt={2} className={classes.title}>
          {" "}
          {props.platform_name}
        </Typography>
      </Box>
    </Box>
  );
}
