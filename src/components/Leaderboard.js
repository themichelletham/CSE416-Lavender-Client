import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Button} from '@material-ui/core';

function createData(playerName, points) {
    return { playerName, points};
  }
  
  const rows = [
    createData('Bob', 1000),
    createData('Surprised_pikachu', 900),
    createData('owo', 750),
    createData('Creamheros', 520),
    createData('Sarah', 360),
  ];

  const useStyles = makeStyles((theme) => ({
        table:{ 
            minWidth: 1300,
            padding: 70,
            margin:'auto'
        },
        head: {
            backgroundColor: "#7D65C0",
            textDecorationColor: "#FFFFFF",
        },
        body:{ 
            backgroundColor: "#FFFFFF"
        }
  })); 
  
  export default function Leaderboard() {
    const classes = useStyles();
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
                key={row.playerName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.playerName}
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