import { useState } from "react";


const EditComment = ({ comment, addNewComment , toggleEditClick,reply }) => {

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

        fetch(`http://localhost:8000/comments/${comment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedComment),
        }).then(() => {
          // trigger a re-fetch of comments
          addNewComment();
        });
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