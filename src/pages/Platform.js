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

const theme = createTheme();
theme.spacing(1); // `${8 * 2}px` = '16px'

const useStyles = makeStyles((theme) => ({
    PlatformContainer: {
        
    },
    PlatformIcon: {
        marginLeft: theme.spacing(5), 
        borderRadius: 20,
        float: "left",
        zIndex: "tooltip",
        width: "1",
        height: "1",
        overflow:'hidden'
    },
    edit: {
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
                <Button>Edit Platform</Button>
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexGrow: 1 }}>
                <Switch>
                    <Route path="/platform/creator" component={PlatformCreator}/>
                </Switch>
            </Box>
        </Box>
    )
}
