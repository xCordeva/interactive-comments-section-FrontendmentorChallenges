import { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // to generate unique ids
import { doc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const SendAReply = ({ currentUserData, addNewComment, comment, commentReplyClicked, toggleCommentReplyClick, reply, replyToReply, db}) => {
  const [replyContent, setReplyContent] = useState(replyToReply ? `@${reply.user.username} `: `@${comment.user.username} `);

  const handleSubmit = (e) => {

    e.preventDefault();
    const newReply = {
        
        content: comment.content,
        createdAt: comment.createdAt,
        id: comment.id,
        score: comment.score,
        user: {
          image: {
            png: comment.user.image.png,
            webp: comment.user.image.webp,
          },
          username: comment.user.username,
        },
        replies: [...comment.replies ,{
            id: uuidv4(), // Generate a unique ID using uuidv4
            content: replyContent.replace(replyToReply ? `@${reply.user.username} `: `@${comment.user.username} `, ''),
            createdAt: Timestamp.now(),
            score: 0,
            replyingTo: replyToReply ? reply.user.username : comment.user.username,
            user: {
                image: {
                    png: currentUserData.image.png,
                    webp: currentUserData.image.webp
                },
            username: currentUserData.username
        }
        }]
    };
    
    // After successfully posting a new comment, call the addNewComment function
    // to trigger a re-fetch of comments.
    addNewComment();
    const docRef = doc(db, 'comments', comment.id);
    setDoc(docRef, newReply)
    setReplyContent(`@${comment.user.username} `);
    toggleCommentReplyClick()
  }

  return (
    <div className={"send-comment reply-to-comment"} style={{ display : commentReplyClicked ? 'block': 'none'}}>
      
      {/*Mobile version because i was too lazy to figure out how to style the form for both versions*/}
      <div className="mobile">
        <form onSubmit={handleSubmit}>
          <textarea
            value={replyContent}
            required
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder='Add a reply...'
          ></textarea>
          <div className="reply-button-photo">
            <img src={require(`${currentUserData.image.png}`)} alt={currentUserData.username} />
            <button type="submit">REPLY</button>
          </div>
        </form>
      </div>

      <div className="desktop">
        <form onSubmit={handleSubmit}>
          <img src={require(`${currentUserData.image.png}`)} alt={currentUserData.username} />
          <textarea
            value={replyContent}
            required
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder='Add a reply...'
          ></textarea>
          <button type="submit">REPLY</button>
        </form>
      </div>
    </div>
  );
}

export default SendAReply;