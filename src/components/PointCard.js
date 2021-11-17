import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Grid, Typography, ImageListItem, TextField, CardMedia, Card, CardActions, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core';
import * as constants from '../components/constants';

const useStyles = makeStyles((theme) => ({
  pointCards: {
    marginTop: theme.spacing(2),
    width: '100%',
    flexWrap: 'wrap',
    flexGrow: 1, 
    
  },
  gridContainer: {
    flexDirection: "column",
  },
  gridItem: {
    //display: "inline-block",
  },
  cardItems:{ 
    display: "inline-flex",
    float: 'center'
    //flexDirection: "row",
  },
  cards:{ 
    display: "inline-block",
    height:"150px", 
    width:"500px",
    paddingTop: theme.spacing(4), 
    borderRadius: 15, 
  },
}));

export default function PointCard(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    platform_name: '',
  });
  const copyState = () => {
    const c = {};
    c.platform_name = state.platform_name;
    return c;
  }
  useEffect(() => {
    axios.get(`${constants.API_PATH}/platform/${props.platform_id}`)
      .then(res => {
        if (res.status === 200) {
          const new_state = copyState();
          new_state.platform_name = res.data.platform_name;
          setState(new_state);
        }
      })
  }, []);
  return (
    <Box mb={5} m={3}>
    <Box container className={classes.pointCards}>
      <Box item className={classes.cardItems}>
      <Card className={classes.cards} variant="outlined">
        <CardContent>
          <Typography align="center">{`Platform_id:${state.platform_name}`}</Typography>
          <Typography align="center">{`Points:${props.points}`}</Typography>
        </CardContent>
      </Card>
      </Box>
    </Box>
    </Box>
  );
};