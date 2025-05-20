import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";

export interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
}

export function useBlogById(id: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authHeader } = useAuth();

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/api/blogs/${id}`, { headers: authHeader })
      .then((res) => {
        setBlog(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch blog", err);
        setError("Failed to load blog");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { blog, loading, error };
}
