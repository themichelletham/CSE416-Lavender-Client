import { Button, makeStyles } from '@material-ui/core'
import { Box } from '@mui/system';
import React from 'react'
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  Opt: {
    display: 'inline-block',
    width: '60vw',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center', 
  },
}));

export default function PlatformCreator() {
  const classes = useStyles();
  const history = useHistory();

  const onSave = (e) => {

  }

  const onDelete = (e) => {
    history.goBack();

  }

  return (
    <Box className={classes.PlatformCreatorContainer}>
      <Button size='small' variant='contained' onClick={onSave} disableElevation>Save Platform</Button>
      <Button size='small' variant='contained' onClick={onDelete} disableElevation>Delete Platform</Button>
      <h1>helllooOOOOOooOo</h1>
    </Box>
  )
}
