import React, {useState,useEffect} from "react";
import { TextField,Button,Typography,Paper } from "@material-ui/core";
import FileBase from "react-file-base64";
import {useDispatch, useSelector} from "react-redux";
import useStyles from "./styles"
import { useHistory } from "react-router-dom";
import { createPost,updatePost } from "../../actions/posts";
const Form= ({currentId,setCurrentId}) =>{
    const classes= useStyles();
    const [postData,setPostData]= useState({title: '',message: '', tags: '',selectedFile:''});
    // const post= useSelector((state)=>currentId?state.posts.find((p)=>p._id===currentId):null);
    const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
    const dispatch= useDispatch();
    const history= useHistory();
    const user=JSON.parse(localStorage.getItem('profile'));
    useEffect(()=>{
        if(post)
        setPostData(post);
    },[post]);
    const clear=()=>{
        setCurrentId(0);
        setPostData({title: '',message: '', tags: '',selectedFile:''})
    }
    const handleSubmit =async(e)=>{
        e.preventDefault();//not to get refresh in the browser
        
        if(currentId===0){
            dispatch(createPost({...postData,name: user?.result?.name},history));
            clear();
        }
        else{
        dispatch(updatePost(currentId,{...postData,name: user?.result?.name}));
        clear();
    }
}
if(!user?.result?.name){
    return(
        <Paper className={classes.paper} elevation={6}>
            <Typography variant="h6" align="center">
                Please Sign In to create your own Post!
            </Typography>
        </Paper>
    )
}
    return(
       <Paper className={classes.paper} elevation={6}>
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ?'Editing':'Creating'} a Memory</Typography>
        {/* <TextField name="creator" variant="outlined" label="Creator" fullWidth value={postData.creator} onChange={(e)=>setPostData({...postData, creator: e.target.value})}/> */}
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e)=>setPostData({...postData, title: e.target.value})}/>
        <TextField name="message" variant="outlined" label="Message" fullWidth value={postData.message} onChange={(e)=>setPostData({...postData, message: e.target.value})}/>
        <TextField name="tags" variant="outlined" label="Tags" fullWidth value={postData.tags} onChange={(e)=>setPostData({...postData, tags: e.target.value.split(',')})}/>
        <div className={classes.fileInput}></div>
        <FileBase type="file" multiple={false} onDone={({base64})=> setPostData({...postData,selectedFile:base64})}/>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
        </form>
       </Paper>
    )
}
export default Form;