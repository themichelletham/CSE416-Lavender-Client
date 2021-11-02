import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import * as constants from '../components/constants';
import { makeStyles } from '@material-ui/core'
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory } from 'react-router';
import PlatformProfile from '../components/PlatformProfile.js';
import PlatformLead from "../components/PlatformLead.js";

const useStyles = makeStyles((theme) => ({
  PlatformCreatorContainer: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  Opt: {
    display: 'inline-block',
    width: '60vw',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center', 
  },
  editPlatform: {
    borderRadius: 15,
    borderTopLeftRadius: 15,  
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 60,
    backgroundColor: "#7d65c0",
  },
}));

export default function PlatformCreator(props) {
  const [state, setState] = useState({
    platform_name: '',
  })

  const copyState = () => {
    let new_name = state.platform_name;
    return [new_name];
  }

  const classes = useStyles();
  const history = useHistory();

  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/platform/${props.match.params.platform_id}/creator`, {
      platform_fields: { platform_name: state.platform_name, }
    }).then(res => {
      // TODO: DO something after udpate
    }).catch(err => {
      console.log('PUT on Save: ', err);
    })
  }

  const onDelete = (e) => {
    axios.delete(`${constants.API_PATH}/platform/${props.match.params.platform_id}`)
    .then(res => {
      history.goBack()
    }).catch(err => {
      console.log(err);
    })
  }

  const onTitleChange = (e) => {
    let [new_name] = copyState();
    new_name = e.target.value;
    setState({
      platform_name: new_name,
    });
  }

  return (
    <Box className={classes.PlatformCreatorContainer}>
      <PlatformProfile/>
      <PlatformLead/>
      <Box className={classes.Opt} mt={3}>
        <Button size='small' variant='contained' onClick={onSave} disableElevation>Save Platform</Button>
        <Button size='small' variant='contained' onClick={onDelete} disableElevation>Delete Platform</Button>
      </Box>
      <FormControl className={classes.editPlatform}>
        <InputBase className={classes.title}
          inputProps={{
            min: 0,
            style: {
              textAlign: 'center', fontSize: 22, paddingTop: 0, paddingBottom: 0,
              marginTop: 10
            }
          }}
          value={state.platform_name}
          onChange={onTitleChange}
        />
      </FormControl>
    </Box>
  )
}
