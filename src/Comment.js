import replyImage from './images/icon-reply.svg'
import Reply from './Reply'
import SendAComment from './SendAComment'
import editImage from './images/icon-edit.svg'
import deleteImage from './images/icon-delete.svg'
import { useState } from 'react'
import Popup from './Popup'
import SendAReply from './SendAReply'
import PermittedVoting from './PermittedVoting'
import EditComment from './EditComment'
import { doc, deleteDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';



const Comment = ({commentsData, currentUserData, triggerRefetch, getComments, db}) => {

    //voting vars
    const [upvotedComments, setUpvotedComments] = useState(new Set());
    const [downvotedComments, setDownvotedComments] = useState(new Set());
    const [ownVote, setOwnVote]= useState(false)
    
    // showing a message to the user when trying to vote in a comment of their own
    const ownVoteHandle = ()=>{
        setOwnVote(true)
        setTimeout(() => {
            setOwnVote(false)
        }, 1500);
    }
    // funtion to manage the upvoting system, checks if the the user is upvoted their self it activates the ownVote func, checks if the upvoted comment was not stored before it stores and checks if it was downvoted it removes the downvote and upvotes with a +1, finally if its upvoted already and user clicks on upvote again it removes the vote and the stored id

    const upvote = (comment) => {
        const newUpvotedComments = new Set(upvotedComments);
        const newDownvotedComments = new Set(downvotedComments);
        
        if(comment.user.username === currentUserData.username){
            ownVoteHandle()
        }
        else if (!newUpvotedComments.has(comment.id)) {
          newUpvotedComments.add(comment.id);
          if (newDownvotedComments.has(comment.id)) {
            // If the comment was previously downvoted, adjust the score accordingly
            comment.score += 2;
            newDownvotedComments.delete(comment.id);
          }
          else{
            comment.score += 1;
          }
        }
        else{
          newUpvotedComments.delete(comment.id);
          comment.score -= 1;
        }
        setUpvotedComments(newUpvotedComments);
        setDownvotedComments(newDownvotedComments);
    };

    // same logic as upvote
    const downvote = (comment) => {
        const newDownvotedComments = new Set(downvotedComments);
        const newUpvotedComments = new Set(upvotedComments);

    if(comment.user.username === currentUserData.username){
        ownVoteHandle()
    }
    else if (!newDownvotedComments.has(comment.id)) {
        newDownvotedComments.add(comment.id);
        if (newUpvotedComments.has(comment.id)) {
        // If the comment was previously upvoted, adjust the score accordingly
        comment.score -= 2;
        newUpvotedComments.delete(comment.id);
        }
        else{
        comment.score -= 1;
        }
    }
    else{
        newDownvotedComments.delete(comment.id);
        comment.score += 1;
    }
        setUpvotedComments(newUpvotedComments);
        setDownvotedComments(newDownvotedComments);
    };

    // when a new comment is added this func is triggerd it refetches the data to show the added comment 
    const addNewComment = () => {
        triggerRefetch();
    };

    // func to remove the comments from json server and refreshing the data shown to remove the deleted
    const handleDelete = (comment)=>{
        deleteDoc(doc(db, 'comments', comment.id))
        addNewComment();
        setDeleteClicked(false)
    }

    // vars and funcs to trigger the events of delete, edit, reply
    const [deletePopups, setDeletePopups] = useState(null);
    const [replyPopup, setReplyPopup] = useState(null);
    const [editPopup, setEditPopup] = useState(null);
    const [editClicked, setEditClicked] = useState(false)
    const [deleteClicked, setDeleteClicked] = useState(false)
    const [commentReplyClicked, setCommentReplyClicked] = useState(false)

    const toggleEditClick = ()=>{
        setEditClicked(false)
    }
    const toggleDeleteClick = ()=>{
        setDeleteClicked(!deleteClicked)
        setEditClicked(false)
    }
    const toggleCommentReplyClick = ()=>{
        setCommentReplyClicked(!commentReplyClicked)
    }
    
    function formatTimestamp(createdAt) {
        return formatDistanceToNow(new Date(createdAt.toDate()), { addSuffix: true });
    }

    return (
        
        <div className="comments">
           
            {commentsData.map((comment)=>(
                 
                <div key={comment.id}>
                    <div className="comment-container" >
                        <div className="mobile-comment-footer">
                            <div className="votes-counter">
                                <p className={
                                    upvotedComments.has(comment.id) ? 'chosen up' : ''
                                    } 
                                    onClick={()=>upvote(comment)
                                    }>+</p>
                                <p>{comment.score}</p>
                                <p className={
                                    downvotedComments.has(comment.id)  ? 'chosen down' : ''
                                    } onClick={()=>downvote(comment)}>-</p>
                            </div>
                            {/* a lot of reused code because iam so lazy to figure out how to style */}
                            {comment.user.username === currentUserData.username ?
                                
                                <div className="current-user-options mobile">
                                    
                                    <div className="reply edit" onClick={() => {
                                        setEditClicked(true)
                                        setEditPopup(comment.id)
                                    }
                                    }>
                                        <img src={editImage} alt="Edit" />
                                        <p>Edit</p>
                                    </div>
                                    
                                    <div className="reply delete" onClick={() => {
                                        setDeleteClicked(true)
                                        setDeletePopups(comment.id)
                                        }
                                    }>
                                        <img src={deleteImage} alt="Delete" />
                                        <p className='delete'>Delete</p>
                                        
                                    </div>
                                    {deletePopups === comment.id &&deleteClicked && (
                                    <Popup handleDelete={() => handleDelete(comment)} toggleDeleteClick={toggleDeleteClick} deleteClicked={deleteClicked}/>
                                    )}
                                </div>
                                :
                                <div className="reply mobile" onClick={() => {
                                    setCommentReplyClicked(true)
                                    setReplyPopup(comment.id)
                                    }
                                }>
                                    <img src={replyImage} alt="reply" />
                                    <p>Reply</p>
                                </div>
                            }
                        </div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <div className="header-info">
                                    <img src={require(`${comment.user.image.png}`)} alt="amyrobson" />
                                    <p>{comment && comment.user.username}</p>

                                    {comment.user.username === currentUserData.username ? <p className='you-tag'>you</p>: null}
                                    {}
                                    <p className='created-at'>{formatTimestamp(comment.createdAt)}</p>
                                </div>

                                {comment.user.username === 'cordeva' ?
                                
                                <div className="current-user-options desktop">
                                    
                                    <div className="reply edit" onClick={() => {
                                        setEditClicked(true)
                                        setEditPopup(comment.id)
                                    }
                                    }>
                                        <img src={editImage} alt="Edit" />
                                        <p>Edit</p>
                                    </div>
                                    
                                    <div className="reply delete" onClick={() => {
                                        setDeleteClicked(true)
                                        setDeletePopups(comment.id)
                                        }
                                    }>
                                        <img src={deleteImage} alt="Delete" />
                                        <p className='delete'>Delete</p>
                                        
                                    </div>
                                    {deletePopups === comment.id &&deleteClicked && (
                                    <Popup handleDelete={() => handleDelete(comment)} toggleDeleteClick={toggleDeleteClick} deleteClicked={deleteClicked}/>
                                    )}
                                </div>
                                :
                                <div className="reply desktop" onClick={() => {
                                    setCommentReplyClicked(true)
                                    setReplyPopup(comment.id)
                                    }
                                }>
                                    <img src={replyImage} alt="reply" />
                                    <p>Reply</p>
                                </div>}

                            </div>
                            <div className="comment-body">
                                {editPopup === comment.id && editClicked ? (
                                <EditComment comment={comment} currentUserData={currentUserData} addNewComment={addNewComment} toggleEditClick={toggleEditClick} db={db}/>
                                ) : (
                                <p>{comment.content}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {comment.replies.length > 0 && (
                        <Reply comment={comment} currentUserData={currentUserData} triggerRefetch={triggerRefetch} ownVoteHandle={ownVoteHandle}  db={db}/>
                    )}

                    {/* styling the Send a reply differently from seand a comment */}
                    {replyPopup === comment.id && 
                    <div className="reply-container">
                        <div className="left-side">
                            <div className="line"></div>
                        </div>
                        <div className="replies">
                            <div className="right-side" key={comment.id}>
                                <SendAReply addNewComment={addNewComment} currentUserData={currentUserData} comment={comment} commentReplyClicked={commentReplyClicked} toggleCommentReplyClick={toggleCommentReplyClick} db={db}/>
                            </div>
                        </div>
                    </div>}

                </div>
                
            ))}
            
            <SendAComment addNewComment={addNewComment} currentUserData={currentUserData} toggleEditClick={toggleEditClick} commentsData={commentsData} db={db}/>
            {ownVote && <PermittedVoting />}
        </div>
    );
}
 
export default Comment;