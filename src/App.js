import Comment from "./Comment";
import useFetch from './useFetch';
import { useState } from 'react';

function App() {
  const [commentsTrigger, setCommentsTrigger] = useState(false); // Create a trigger state
  const { data, isPending } = useFetch('http://localhost:8000/comments', commentsTrigger);
  const { data: currentUser } = useFetch('http://localhost:8000/currentUser');

  // a function to trigger a re-fetch of comments
  const triggerRefetch = () => {
    setCommentsTrigger(!commentsTrigger); // Toggle the trigger state to force a re-fetch
  };

  return (
    <div className="App">
      {data && currentUser && <Comment data={data} currentUser={currentUser} triggerRefetch={triggerRefetch} />}
      {isPending && <div>Loading...</div>}
    </div>
  );
}

export default App;