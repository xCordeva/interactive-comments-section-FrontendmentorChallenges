import { useState } from "react";
import { doc, setDoc } from 'firebase/firestore';

const EditComment = ({ comment, addNewComment, toggleEditClick, reply, db }) => {

    const [content, setContent] = useState(`@${reply.replyingTo} ` + reply.content);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const updatedReplies = comment.replies.map((chosenReply) => {
          if (chosenReply.id === reply.id) {
            return {
              ...chosenReply,
              content: content.replace(`@${reply.replyingTo} `, ''),
            };
          }
          return chosenReply;
        });
        
        const updatedComment = {
          ...comment,
          replies: updatedReplies,
        };      


      const docRef = doc(db, 'comments', comment.id);
      setDoc(docRef, updatedComment)
      addNewComment();
      toggleEditClick()
    }

    return (
        <div className="edit">
            <div className="edit-comment">
                <form onSubmit={handleSubmit}>
                    <textarea
                    value={content}
                    required
                    onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button type="submit">UPDATE</button>
                </form>
            </div>
        </div>
    );
}
 
export default EditComment;