import { Button } from '@material-ui/core';
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import React from 'react'
import PlatformLead from "../components/PlatformLead.js";
import PlatformCreator from './PlatformCreator.js';
import PlatformProfile from '../components/PlatformProfile.js';

const useStyles = makeStyles((theme) => ({
    PlatformContainer: {
        
    },
    PlatformIcon: {
        borderRadius: "50%",
        float: "left",
        zIndex: "1201",
        width: "1",
        height: "1"
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
            <Box className={classes.edit}>
                <Link to="/platform/creator">
                    <Button>Edit Platform</Button>
                </Link>
            </Box>
            <Switch>
                <Route path="/platform/creator" component={PlatformCreator}/>
            </Switch>
        </Box>
    )
}
