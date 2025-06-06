// import React,{ useState,useEffect } from "react";
// import { AppBar, Avatar, Button, Toolbar, Typography } from "@material-ui/core";
// import memories from "../../images/favicon.png";
// import useStyles from "./styles";
// import { Link,useHistory, useLocation } from "react-router-dom";
// import { LOGOUT } from "../../constants/actionTypes";
// import { useDispatch } from "react-redux";
// import decode from "jwt-decode";
// const Navbar = () => {
//     const [user,setUser]= useState(JSON.parse(localStorage.getItem('profile'))); // [null,()=>{}]
//     const classes= useStyles();
//     const dispatch=useDispatch();
//     const location=useLocation();
//     const history=useHistory();
//     // const token=user?.token;
//     useEffect(() => {
//       const token = user?.token;
//       if(token){
//           const decodedToken=decode(token);//decode token
//           if(decodedToken.exp * 1000 < new Date().getTime()) 
//                 logout();//logout if user token expires
//         }
//         setUser(JSON.parse(localStorage.getItem('profile')));
//     }, [location])
//     const logout=()=>{
//         dispatch({type:LOGOUT});
//         history.push('/');
//         setUser(null);
//     }
    // console.log(user);
    import React, { useState, useEffect } from 'react';
    import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
    import { Link, useHistory, useLocation } from 'react-router-dom';
    import { useDispatch } from 'react-redux';
    import decode from 'jwt-decode';
    
    import memories from '../../images/favicon.png';
    import {LOGOUT} from '../../constants/actionTypes';
    import useStyles from './styles';
    
    const Navbar = () => {
      const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
      const dispatch = useDispatch();
      const location = useLocation();
      const history = useHistory();
      const classes = useStyles();
    
      const logout = () => {
        dispatch({ type:LOGOUT });
    
        history.push('/auth');
    
        setUser(null);
      };
      
      useEffect(() => {
        const token = user?.token;
        if (token) {
          const decodedToken =decode(token);
          // console.log(decodedToken);
          if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
    
        setUser(JSON.parse(localStorage.getItem('profile')));
        //eslint-disable-next-line
      }, [location]);
    return(
    <AppBar className={classes.appBar} position="static" color="inherit">
    <div className={classes.brandContainer}>
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">Memories</Typography>
        <img src={memories} className={classes.image} alt="memories" height="60"></img>
    </div>
    <Toolbar className={classes.toolbar}>
        {user?.result? (
            <div className={classes.profile}>
                <Avatar className={classes.purple} alt={user.result.name} src={user.result?.picture}> {user.result?.name.charAt(0)}</Avatar>
                <Typography className={classes.userName} variant="h6">{user.result?.name}</Typography>
                <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
            </div>
        ) : (
            <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
        </Toolbar>
    </AppBar>
    )
};

export default Navbar;