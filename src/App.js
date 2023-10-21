import Comment from "./Comment";
import { useState,useEffect } from 'react';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs,query, orderBy  } from 'firebase/firestore'
import firebaseConfig from './FirebaseConfig'; //my key and info


// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const getComments = query(collection(db, 'comments') ,orderBy('createdAt', 'asc'))
const getUser = collection(db, 'currentUser')


function App() {

  const [commentsData, setCommentsData] = useState(null)
  const [currentUserData, setCurrentUserData] = useState(null)
  const [combinedArray, setCombinedArray] = useState(null)
  const [commentsTrigger, setCommentsTrigger] = useState(false); // Create a trigger state

  // a function to trigger a re-fetch of comments
  const triggerRefetch = () => {
    setCommentsTrigger(!commentsTrigger); // Toggle the trigger state to force a re-fetch
  };
  ///
  useEffect(() => {
    //fetching the data from firebase
    getDocs(getComments)
    .then(snapshot => {
      let shots = []
      let ids = []
      snapshot.docs.forEach(doc => {
        shots.push({ ...doc.data(), id: doc.id })
        ids.push({ ...doc.id, id: doc.id })
      })

      // compining the ids with the data
      const combinedData = shots.map((item, index) => {
        return {
          id: ids[index],
          ...item
        };
      });
      setCombinedArray(combinedData)
      setCommentsData(shots)
    })
    .catch(err => {
      console.log(err.message)
    })

    getDocs(getUser)
      .then(snapshot => {
        let shots = []
        snapshot.docs.forEach(doc => {
          shots.push({ ...doc.data(), id: doc.id })
        })
        return shots;
      }).then((data)=>{
        setCurrentUserData(data)
      })
      .catch(err => {
        console.log(err.message)
      })
  
  }, [commentsTrigger]);

  return (
    <div className="App">
      {commentsData && currentUserData && <Comment commentsData={combinedArray} currentUserData={currentUserData[0]} triggerRefetch={triggerRefetch} db={db} getComments={getComments}/>}
    </div>
  );
}

export default App;