import React, { useState, useEffect } from 'react'
import axios from 'axios';
import * as constants from './constants'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@material-ui/core';

function createData(playerName, points) {
  return { playerName, points };
}

//const rows = [
//  createData('Bob', 1000),
//  createData('Surprised_pikachu', 900),
//  createData('owo', 750),
//  createData('Creamheros', 520),
//  createData('Sarah', 360),
//];

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 1300,
    padding: 70,
    margin: 'auto'
  },
  head: {
    backgroundColor: "#7D65C0",
    textDecorationColor: "#FFFFFF",
  },
  body: {
    backgroundColor: "#FFFFFF"
  }
}));

export default function Leaderboard() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios.get(`${constants.API_PATH}/users`)
      .catch(err => {
        console.log('Leaderboard: ', err);
      }).then(res => {
        if (res.status === 200) {
          setRows(res.data); 
        }
      })
  }, [])
  return (
    <TableContainer className={classes.table}>
      <Table>
        <TableHead className={classes.head}>
          <TableRow className={classes.header} >
            <TableCell>PLAYER NAME</TableCell>
            <TableCell align="right">POINTS&nbsp;</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.body} >
          {rows.map((row) => (
            <TableRow
              key={row.username}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.points}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  style={{
                    margin: 'auto',
                    maxWidth: 200,
                    backgroundColor: "#7D65C0"
                  }}
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}