import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Alert from '@mui/material/Alert';
import PointCard from '../components/PointCard'
import { Button, Box, Grid, Typography, ImageListItem, TextField } from '@mui/material'
import { makeStyles } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider } from '@material-ui/styles';
import * as constants from '../components/constants';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';


const theme = createTheme();
theme.spacing(1);

const useStyles = makeStyles((theme) => ({
  profilePage: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
  },
  banner: {
    width: theme.spacing(166.5),
    height: theme.spacing(30),
    width: "100%",
    overflow: "hidden",
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 'modal',
    background: '#7d65c0'
  },
  icon: {
    float: 'center',
    //marginTop: 10,
    marginLeft: theme.spacing(0),
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(),
    height: theme.spacing(22),
    width: theme.spacing(22),
    borderRadius: '100%',
    position: 'absolute',
  },
  username: {
    display: 'inline-flex',
    marginTop: theme.spacing(35),
    align: "center", 
  },
  pointsContainer: {
    float: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //alignItems: 'left',
    //width: '100%',
  },
  pointsRow: {
    flexDirection: 'row',
    width: '100%'
  }, 
}));

export default function Profile(props) {
  const [state, setState] = useState({
    user: null,
    points: [],
  });
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [usernameExist, setUsernameExist] = useState(false);

  const copyState = () => {
    let new_user = state.user;
    let new_points = [...state.points];
    return [new_user, new_points];
  }

  const onUsernameChange = (e) => {
    let [new_user, new_points] = copyState();
    new_user.username = e.target.value;
    setState({
      user: new_user,
      points: new_points,
    });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSaveEditName = () => {
    axios.put(`${constants.API_PATH}/users/${props.match.params.user_id}`, {
      user_fields: { username: state.user.username }
    }).then(res => {
      setOpen(false);
    }).catch(err => {
      console.log('PUT on Save: ', err);
      setUsernameExist(true);
    })
  };

  const preProcess = (data) => {
    const new_state = {};
    new_state.user = { ...data.user };
    const points_arr = [];
    for (let i = 0; i < data.points.length; ++i) {
      if (i % 2 == 0)
        points_arr.push([{ ...data.points[i] }]);
      else
        points_arr[parseInt(i/2)].push({ ...data.points[i] });
    }
    new_state.points = points_arr;
    return new_state;
  };

  useEffect(() => {
    axios.get(`${constants.API_PATH}/users/${props.match.params.user_id}`)
      .catch(err => {
        console.log('Profile: ', err);
      }).then(res => {
        console.log(res)
        if (res.status == 200) {
          const new_state = preProcess(res.data);
          setState(new_state);
        }
      })
  }, [props]);

  return (
    <Box className={classes.profilePage} align="center">
      <Box className={classes.banner} />
      <img className={classes.icon} src={state.user && state.user.picture} />
      <Box className={classes.username}>
          <Typography variant="h5" align="center" mb={1}>{state.user && state.user.username}</Typography>
          <IconButton onClick={handleClickOpen}><EditIcon/></IconButton>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Username</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" id="username" label="Username" type="username" fullWidth variant="standard" onChange={onUsernameChange} />
          </DialogContent>
          {
            usernameExist == true ? <Alert severity="error">Username is already taken</Alert> : <p></p>
          }
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSaveEditName}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box className={classes.totalPoints} mt={1}>
        <Typography>Total Points: {state.user && state.user.points}</Typography>
      </Box>
      <div>
      <Box className={classes.pointsContainer}>
        {state.points.length ? state.points.map((pair) => {
          const ret = (
            <Box className={classes.pointRow} sx={{ display: 'flex', flexWrap: 'wrap', width: '100%'}}>
              <PointCard points={pair[0].points} platform_id={pair[0].platform_id} />
              {pair.length === 2 ?
                <PointCard points={pair[1].points} platform_id={pair[1].platform_id} />
                : <></>}
            </Box>
          )
          return ret;
        }) : <></>}
      </Box>
      </div>
    </Box>
  )
}