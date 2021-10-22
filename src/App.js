import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import NavBar from './components/NavBar';

const useStyles = makeStyles((theme) => ({
  root: { 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: "#E6E6FA",
    backgroundRepeat: "no-repeat"
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <Router>
      <div className = {classes.root}> 
        <CssBaseline/> 
        <NavBar/>
      </div> 
    </Router>
  ); 
}
