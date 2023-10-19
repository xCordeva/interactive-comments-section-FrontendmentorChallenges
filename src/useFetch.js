import { useEffect, useState } from "react";

const useFetch = (url, triggerRefetch) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const abortController = new AbortController();

    fetch(url, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok) {
          throw Error("Fetch is not OK");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsPending(false);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Aborted");
        } else {
          setError(err.message);
          setIsPending(false);
        }
      });

    // cleanup the fetch if the component unmounts or triggerRefetch changes
    return () => {
      abortController.abort();
    };
  }, [url, triggerRefetch]);

  return { data, isPending, error };
};

export default useFetch;
