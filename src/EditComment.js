import { useState } from "react";
import { doc, setDoc } from 'firebase/firestore';


const EditComment = ({ comment, addNewComment , toggleEditClick, db }) => {

    const [content, setContent] = useState(comment.content);

    const handleSubmit = (e) => {
      
        e.preventDefault();

        const editComment = {
          ...comment,
          content,
          
        };
        
        const docRef = doc(db, 'comments', comment.id);
        setDoc(docRef, editComment)
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