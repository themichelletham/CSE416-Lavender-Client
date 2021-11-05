import { Button } from '@material-ui/core';
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import React from 'react'
import PlatformLead from "../components/PlatformLead.js";
import PlatformCreator from './PlatformCreator.js';
import PlatformProfile from '../components/PlatformProfile.js';
import { createTheme,  MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors'

const ttheme = createTheme();
ttheme.spacing(1); // `${8 * 2}px` = '16px'
const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#7519BD"),
      backgroundColor: "#7519BD",
      "&:hover": {
        backgroundColor: purple[900]
      }
  }));

const useStyles = makeStyles((theme) => ({
    PlatformContainer: {
        display: "flex",
        overflow:'hidden', 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'left', 
        width: ttheme.spacing(200), 
    }, 
    editPlat: {
        marginTop: ttheme.spacing(25), 
        marginLeft: ttheme.spacing(140)
    }
})); 

export default function Platform(props) {
    const classes = useStyles();

    return (
        <Box className={classes.PlatformContainer}>
            <Router>
                <PlatformProfile/>
                <PlatformLead/>
            </Router>
            <Link to="/platform/creator">
                <ColorButton className={classes.editPlat}>Edit Platform</ColorButton>
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
                <Switch>
                    <Route path="/platform/creator" component={PlatformCreator}/>
                </Switch>
            </Box>
        </Box>
    )
}
