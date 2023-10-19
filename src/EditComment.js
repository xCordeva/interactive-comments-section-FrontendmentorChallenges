import { useState } from "react";

const EditComment = ({ comment, addNewComment , toggleEditClick }) => {

    const [content, setContent] = useState(comment.content);

    const handleSubmit = (e) => {
      
        e.preventDefault();

        const editComment = {
          ...comment,
          content,
        };
        
        fetch(`http://localhost:8000/comments/${comment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editComment),
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