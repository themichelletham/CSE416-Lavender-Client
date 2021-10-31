import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { List, ListItem, ListItemText, Toolbar, Typography } from '@material-ui/core';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { padding } from '@mui/system';

const drawerWidth = 205;

const useStyles = makeStyles((theme) => ({
    mainbox: {
        display: "flex",
        zIndex: 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: "#E6E6FA",
            backgroundRepeat: "no-repeat",
        } 
    },
    pleaderboard: {
        borderRadius: "12%",
        backgroundColor: "#FFFFFF",
        margin: "2%"
    }
}));

function PlatformLead() {
    const classes = useStyles();

    return (
        <Box className={classes.mainbox}>
            <Drawer anchor="right" variant="permanent" className={classes.drawer}>
                <Toolbar/>
                <Typography variant="h6">Leaderboard</Typography>
                <Box className={classes.pleaderboard}>
                    <List>
                        {["annie", "judy", "michelle", "steven"].map((text, index)=> (
                            <ListItem>
                                <ListItemText primary={(index + 1) + "\t" + text}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    )
}

export default PlatformLead
