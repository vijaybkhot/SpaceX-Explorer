import { useState, useEffect } from "react";

// Custom hook to fetch data with optional query parameters and body options
const useFetchData = (url, queryParams = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          method: queryParams ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: queryParams ? JSON.stringify(queryParams) : null,
        });

        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();

        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, queryParams]);

  return { data, loading, error };
};

export default useFetchData;
