import React,{useEffect} from 'react'
import {Paper,Typography,CircularProgress,Divider} from '@material-ui/core'
import { useDispatch,useSelector } from 'react-redux'
import moment from 'moment'
import {useParams,useHistory} from 'react-router-dom'
import {getPost, getPostsbySearch} from '../../actions/posts'
import useStyles from './styles.js'
import CommentSection from './CommentSection'

const PostDetails = () => {
    const {post,posts,isLoading}=useSelector((state)=>state.posts);
    const dispatch=useDispatch();
    const classes=useStyles();
    const history=useHistory();
    const {id}=useParams();
    useEffect(()=>{
        dispatch(getPost(id));
        //eslint-disable-next-line
    },[id]);
    useEffect(()=>{
        if(post){
            dispatch(getPostsbySearch({search:'none',tags:post?.tags.join(',')}));
        }
        //eslint-disable-next-line
    },[post]);

    if(!post) return null;
    if(isLoading){
        return(
            <Paper elevation={6} className={classes.loadingPaper}>
              <CircularProgress size="7em"/>
            </Paper>
    )}
    const recommendedPosts=posts.filter(({_id})=>_id!==post._id).slice(0,4);
    const openPost=(id)=>{
        history.push(`/posts/${id}`);
    }
  return (
    <Paper style={{ padding: '10px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
          {/* <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography> */}
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post}/>
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
        </div>
      </div>
      {!!recommendedPosts?.length&&(
        <div className={classes.section}>
          <Typography gutterBottom variant='h5'>You might also like:</Typography>
          <Divider/>
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({title,message,name,likes,selectedFile,_id})=>(
              <Paper style={{margin:'20px',cursor:'pointer',border:'3px solid #e0e0e0',borderRadius: '15px',backgroundColor:'#f9f7fa',padding:'10px',}} elevation={5} onClick={()=>openPost(_id)} key={_id}>
                <Typography gutterBottom variant='h6'>{title}</Typography>
                <Typography gutterBottom variant='subtitle2'>{name}</Typography>
                <Typography gutterBottom variant='subtitle2'>{message.slice(0,50)}...</Typography>
                <Typography gutterBottom variant='subtitle2'>Likes:{likes.length}</Typography>
                <img src={selectedFile} width="200px" style={{borderRadius:'15px', maxHeight:'100px'}} alt={title}/>
          </Paper>
        ))}
        </div>
      </div>
      )}
    </Paper>
  )
}

export default PostDetails