import { useState } from "react";
import { collection, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';


const SendAComment = ({ currentUserData, addNewComment, toggleEditClick,  commentsData, db }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();


    const newComment = {
      content,
      createdAt: Timestamp.now(),
      id: (commentsData.length + 1),
      score: 0,
      user: {
        image: {
          png: currentUserData.image.png,
          webp: currentUserData.image.webp,
        },
        username: currentUserData.username,
      },
      replies: [],
    };
    
    // fetch('http://localhost:8000/comments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newComment),
    // }).then(() => {
    //   // After successfully posting a new comment, call the addNewComment function
    //   // to trigger a re-fetch of comments.
    //   addNewComment();
    // });
    const docRef = collection(db, 'comments');
    addDoc(docRef, newComment)
    // to trigger a re-fetch of comments.
    addNewComment();
    setContent('');
    toggleEditClick()
  }

  return (
    <div className="send-comment">
      {/*Mobile version because i was too lazy to figure out how to style the form for both versions*/}
      <div className="mobile">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            placeholder='Add a comment...'
          ></textarea>
          <div className="reply-button-photo">
            <img src={require(`${currentUserData.image.png}`)} alt={currentUserData.username} />
            <button type="submit">SEND</button>
          </div>
        </form>
      </div>
      
      <div className="desktop">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            placeholder='Add a comment...'
          ></textarea>
          <img src={require(`${currentUserData.image.png}`)} alt={currentUserData.username} />
          <button type="submit">SEND</button>
        </form>
      </div>
    </div>
  );
}

export default SendAComment;