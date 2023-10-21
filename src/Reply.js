import replyImage from './images/icon-reply.svg'
import editImage from './images/icon-edit.svg'
import deleteImage from './images/icon-delete.svg'
import { useState } from 'react'
import Popup from './Popup'
import PermittedVoting from './PermittedVoting'
import EditReply from './EditReply'
import SendAReply from './SendAReply'
import { v4 as uuidv4 } from 'uuid'; // to generate unique ids
import { doc, setDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';


const Reply = ({comment, currentUserData, triggerRefetch, ownVoteHandle, db}) => {

    const [upvotedComments, setUpvotedComments] = useState(new Set());
    const [downvotedComments, setDownvotedComments] = useState(new Set());
    const [ownVote, setOwnVote]= useState(false)

    //same logic and code as commen.js
    const upvote = (reply) => {
        const newUpvotedComments = new Set(upvotedComments);
        const newDownvotedComments = new Set(downvotedComments);
    
        if(reply.user.username === currentUserData.username){
            ownVoteHandle()
        }
        else if (!newUpvotedComments.has(reply.id)) {
          newUpvotedComments.add(reply.id);
          if (newDownvotedComments.has(reply.id)) {
            // If the comment was previously downvoted, adjust the score accordingly
            reply.score += 2;
            newDownvotedComments.delete(reply.id);
          }
          else{
            reply.score += 1;
          }
        }
        else{
          newUpvotedComments.delete(reply.id);
          reply.score -= 1;
        }
        setUpvotedComments(newUpvotedComments);
        setDownvotedComments(newDownvotedComments);
    };
    
    const downvote = (reply) => {
        const newDownvotedComments = new Set(downvotedComments);
        const newUpvotedComments = new Set(upvotedComments);

        if(reply.user.username === currentUserData.username){
            ownVoteHandle()
        }
        else if (!newDownvotedComments.has(reply.id)) {
        newDownvotedComments.add(reply.id);
            if (newUpvotedComments.has(reply.id)) {
            // If the comment was previously upvoted, adjust the score accordingly
            reply.score -= 2;
            newUpvotedComments.delete(reply.id);
            }
            else{
                reply.score -= 1;
            }
        }
        else{
            newDownvotedComments.delete(reply.id);
            reply.score += 1;
        }
        setUpvotedComments(newUpvotedComments);
        setDownvotedComments(newDownvotedComments);
    };

    // when a new comment is added this func is triggerd it refetches the data to show the added comment 
    const addNewComment = () => {
        triggerRefetch();
    };

    // func to remove a specific reply without affecting other replies 
    const [removedReply ,setRemovedReply] = useState(null)

    const handleReplyDelete = (reply) =>{
        const removeReply = {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            score: comment.score,
            user: {
              image: {
                png: comment.user.image.png,
                webp: comment.user.image.webp,
              },
              username: comment.user.username,
            },
            replies: comment.replies.filter((choosenReply)=>choosenReply.id !== reply.id)
        };
        setRemovedReply(removeReply)
    }
    
    const handleDelete = (comment)=>{
        const docRef = doc(db, 'comments', comment.id);
        setDoc(docRef, removedReply)
        addNewComment();
        setDeleteClicked(false)
    }
    
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [commentReplyClicked, setCommentReplyClicked] = useState(false)
    const [deletePopups, setDeletePopups] = useState(null);
    const [replyPopup, setReplyPopup] = useState(null);
    const [editPopup, setEditPopup] = useState(null);
    const [editClicked, setEditClicked] = useState(false)
    const [replyToReply, setReplyToReply] = useState(false)

    const toggleDeleteClick = ()=>{
        setDeleteClicked(!deleteClicked)
    }

    const toggleCommentReplyClick = ()=>{
        setCommentReplyClicked(!commentReplyClicked)
    }

    const toggleEditClick = ()=>{
        setEditClicked(false)
    }
    
    // func to show the live time based on the timestamp thats send with every new comment/reply
    function formatTimestamp(createdAt) {
        return formatDistanceToNow(new Date(createdAt.toDate()), { addSuffix: true });
    }
    return (
        
        <div className="reply-container">

            <div className="left-side">
                <div className="line"></div>
            </div>

            <div className="replies">
                
                <div className="right-side" key={comment.id}>
                
                    {comment.replies.map((reply)=>(
                        
                        <div key={uuidv4()}>
                            <div className="reply-content-container" key={reply.id}>
                            <div className="mobile-comment-footer">
                                <div className="votes-counter">
                                    <p className={
                                    upvotedComments.has(reply.id) ? 'chosen up' : ''
                                    } 
                                    onClick={()=>upvote(reply)
                                    }>+</p>
                                    <p>{reply.score}</p>
                                    <p className={
                                    downvotedComments.has(reply.id)  ? 'chosen down' : ''
                                    } onClick={()=>downvote(reply)}>-</p>
                                </div>

                                {reply.user.username === currentUserData.username ?
                                    <div className="current-user-options mobile">
                                        <div className="reply edit" onClick={() => {
                                            setEditClicked(true)
                                            setEditPopup(reply.id)
                                        }
                                        }>
                                            <img src={editImage} alt="Edit" />
                                            <p>Edit</p>
                                        </div>
                                        <div className="reply delete" onClick={() => {
                                            setDeleteClicked(true)
                                            setDeletePopups(reply.id)
                                            handleReplyDelete(reply)
                                        }
                                        }>
                                            <img src={deleteImage} alt="Delete" />
                                            <p className='delete'>Delete</p>
                                        </div>
                                        {deletePopups === reply.id &&deleteClicked && (
                                        <Popup handleDelete={() => handleDelete(comment)} toggleDeleteClick={toggleDeleteClick} deleteClicked={deleteClicked} />
                                        )}
                                    </div>
                                    
                                    :
                                    <div className="reply mobile" onClick={() => {
                                        setCommentReplyClicked(true)
                                        setReplyPopup(reply.id)
                                        setReplyToReply(true)
                                        }
                                    }>
                                    <img src={replyImage} alt="reply" />
                                    <p>Reply</p>
                                </div>}
                            </div>
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <div className="header-info">
                                            <img src={require(`${reply.user.image.png}`)} alt="amyrobson" />
                                            <p>{reply.user.username}</p>

                                            {reply.user.username === currentUserData.username ? <p className='you-tag'>you</p>: null}
                                            
                                            <p className='created-at'>{formatTimestamp(reply.createdAt)}</p>
                                        </div>


                                        {reply.user.username === currentUserData.username ?
                                        <div className="current-user-options desktop">
                                            <div className="reply edit" onClick={() => {
                                                setEditClicked(true)
                                                setEditPopup(reply.id)
                                            }
                                            }>
                                                <img src={editImage} alt="Edit" />
                                                <p>Edit</p>
                                            </div>
                                            <div className="reply delete" onClick={() => {
                                                setDeleteClicked(true)
                                                setDeletePopups(reply.id)
                                                handleReplyDelete(reply)
                                            }
                                            }>
                                                <img src={deleteImage} alt="Delete" />
                                                <p className='delete'>Delete</p>
                                            </div>
                                            {deletePopups === reply.id &&deleteClicked && (
                                            <Popup handleDelete={() => handleDelete(comment)} toggleDeleteClick={toggleDeleteClick} deleteClicked={deleteClicked} />
                                            )}
                                        </div>
                                        
                                        :
                                        <div className="reply desktop" onClick={() => {
                                            setCommentReplyClicked(true)
                                            setReplyPopup(reply.id)
                                            setReplyToReply(true)
                                            }
                                        }>
                                        <img src={replyImage} alt="reply" />
                                        <p>Reply</p>
                                        </div>}
                                        
                                    </div>
                                    <div className="comment-body">
                                        {editPopup === reply.id && editClicked ? (
                                        <EditReply comment={comment} addNewComment={addNewComment} toggleEditClick={toggleEditClick} reply={reply} db={db}/>
                                        ) : (
                                            <p><span>@{reply.replyingTo} </span>{reply.content}</p>
                                        )}
                                    </div>
                                    {/* styling the Send a reply differently from seand a comment */}
                                    
                                </div>
                                
                            </div>
                            
                            {replyPopup === reply.id && 
                                <div>
                                    <SendAReply addNewComment={addNewComment} currentUserData={currentUserData} comment={comment} commentReplyClicked={commentReplyClicked} toggleCommentReplyClick={toggleCommentReplyClick} reply={reply} replyToReply={replyToReply} db={db}/>
                                </div>
                            }
                        </div>
                    ))}
                </div>
             
                {ownVote && <PermittedVoting />}
            </div>
        </div>
    );
}
 
export default Reply;