import React, { useEffect, useRef, useState } from "react";

const compareObjects = (obj1, obj2) => {
  if (!obj1 || !obj2 || typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }

  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

const UseFetch = (url, options) => {
  const optionsRef = useRef(null);
  const urlRef = useRef(null);
  const [value, setValue] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(0);

  useEffect(() => {
    if (!optionsRef.current || compareObjects(optionsRef.current, options)) {
      optionsRef.current = options;
    }

    if (!urlRef.current || urlRef === url) {
      urlRef.current = url;
    }
  }, [urlRef, optionsRef]);

  useEffect(() => {
    setLoading(true);

    let wait = false;

    try {
      const fetchData = async () => {
        if (!wait) {
          const data = await fetch(url, options);
          const response = await data.json();

          setValue(response);

          const status = response.headers.get("status");

          if (/^[4-5]{1}/.test(status.toString())) {
            setErrorMessage(
              "Something went wrong with your todo creation. You might not be authorized to do this operation."
            );
          }

          setFetchStatus(status);
        }
        fetchData();
      };
    } catch (error) {
      console.error("error in useFetch");
      setErrorMessage(
        error?.message || "Something went wrong. Try to refresh the page."
      );
    } finally {
      setLoading(false);
    }

    return () => {
      let wait = true;
    };
  }, []);

  return { value, errorMessage, loading, fetchStatus };
};

export default UseFetch;
