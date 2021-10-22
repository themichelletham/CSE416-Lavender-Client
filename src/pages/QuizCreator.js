import React, { useState, useEffect } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import { Box, Button, FormControl, InputBase, TextField } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import * as constants from '../components/constants'

const useStyles = makeStyles((theme) => ({
  QuizContainer:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '60vw'
  },
  Opt:{
    display: 'inline-block',
    width: '60vw',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center'
  },
  duration:{
    display: 'inline-block',
    float: 'left',
    fontSize: 16,
    fontWeight: 'bold'
  },
  save:{
    display: 'inline-block',
    float: 'right',
  },
  title:{
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15, 
    height: 60,
    backgroundColor: "#7d65c0",
  },
  quizForm:{
    borderRadius: 15,
    borderTopLeftRadius: 15
  },
  noBorder: {
    border: 'none',
  }
}))


export default function QuizCreate(props) {
  const [state, setState] = useState({
    quiz_name: '',
  })
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const onSave = (e) => {
    axios.put(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}/creator`, {
      quiz_fields: {...state}
    }).then( res => {
      // TODO: DO something after udpate
    }).catch( err => {
      console.log('PUT on Save: ', err);
    })
  };
  const style = {
    backgroundColor: '#ACACE1',
    marginLeft: 10,
    marginBottom: 10,
    color: 'black'
  }
  const onDelete = (e) => {
    axios.delete(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then( res => {
        history.goBack()
      }).catch( err => {
        console.log(err);
      })
  }
  const onTitleChange = (e) => {
    setState({...state, quiz_name:e.target.value});
  }
  useEffect(() => {
    if(props.location.state == null){
      axios.get(`${constants.API_PATH}/quiz/${props.match.params.quiz_id}`)
      .then( res => {
        //console.log(res);
        setState({quiz_name: res.data.quiz_name})
      }).catch( err => {
        console.log(err);
      })
    }
    else if(props.location.state){
      setState({quiz_name: props.location.state.quiz.quiz_name})
    }
  }, [props]);
  return (
    <Box className={classes.QuizContainer}>
      <Box className={classes.Opt} mt={10} >
        <div className={classes.duration}>Duration: INF</div>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onDelete}>Delete Quiz</Button>
        <Button size='small' variant='contained' style={style} className={classes.save}  onClick={onSave}>Save Quiz</Button>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase className={classes.title}
          inputProps={{min: 0, 
            style: { textAlign: 'center', fontSize: 22, paddingTop:0, paddingBottom:0,
              marginTop:10}}}
          value={state.quiz_name}
          onChange={onTitleChange}/>
      </FormControl>
    </Box>
  )
}
