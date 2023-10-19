import { useState } from "react";

const SendAComment = ({ currentUser, addNewComment,toggleEditClick }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      content,
      createdAt: 'A few seconds ago',
      score: 0,
      user: {
        image: {
          png: currentUser.image.png,
          webp: currentUser.image.webp,
        },
        username: currentUser.username,
      },
      replies: [],
    };
    
    fetch('http://localhost:8000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    }).then(() => {
      // After successfully posting a new comment, call the addNewComment function
      // to trigger a re-fetch of comments.
      addNewComment();
    });

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
            <img src={require(`${currentUser.image.png}`)} alt={currentUser.username} />
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
          <img src={require(`${currentUser.image.png}`)} alt={currentUser.username} />
          <button type="submit">SEND</button>
        </form>
      </div>
    </div>
  );
}

export default SendAComment;