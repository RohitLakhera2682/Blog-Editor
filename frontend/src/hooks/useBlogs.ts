import { useEffect, useState } from "react";
import axios from "axios";

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}) // Update if needed
      .then((res) => {
        // 👇 Check if res.data is an array
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        } else {
          console.warn("Unexpected response format:", res.data);
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
        setLoading(false);
      });
  }, []);

  return { blogs, loading };
};
