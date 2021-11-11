import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Grid, Typography, ImageListItem, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core';
import * as constants from '../components/constants';

const useStyles = makeStyles((theme) => ({
  totalPoints: {

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
    <Box className={classes.totalPoints}>
      <Typography>
        {`Platform_id:${state.platform_name} Points:${props.points}`}
      </Typography>
    </Box>
  );
};