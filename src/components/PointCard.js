import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Card, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core';
import * as constants from '../components/constants';

const useStyles = makeStyles((theme) => ({
  pointCards: {
    marginTop: theme.spacing(2),
    width: '100%',
    flexWrap: 'wrap',
    flexGrow: 1, 
    direction:"column",
    alignItems:"center",
    justifyContent:"center",
  },
  cardItems:{ 
    display: "inline-flex",
    float: 'center', 
    alignItems: "center"
  },
  cards:{ 
    display: "inline-block",
    float: "center",
    width: theme.spacing(80), 
    height: theme.spacing(15),
    paddingTop: theme.spacing(3), 
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
    <Box>
    <Grid container spacing={3} className={classes.pointCards}>
      <Grid item className={classes.cardItems} item xs={10} md={10}>
      <Card className={classes.cards} variant="outlined">
        <CardContent >
          <Typography align="center">{`Platform_id:${state.platform_name}`}</Typography>
          <Typography align="center">{`Points:${props.points}`}</Typography>
        </CardContent>
      </Card>
      </Grid>
    </Grid>
    </Box>
  );
};