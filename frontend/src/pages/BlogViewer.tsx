import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface Blog {
  id: number;
  title: string;
  content: string;
  tags: string;
  updatedAt: string;
}

const BlogViewer: React.FC = () => {
  const { id } = useParams();
  const { authHeader } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/view/${id}`, {
          headers: authHeader,
        });
        setBlog(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, authHeader]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!blog) return null;

  const tags = blog.tags.split(",").filter((tag) => tag.trim() !== "");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
           {tags.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-2">
    {tags.map((tag, index) => (
      <span
        key={index}
        className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
      >
        {tag}
      </span>
    ))}
  </div>
)}
      <p className="text-lg text-gray-400 mb-6">Published on: {new Date(blog.updatedAt).toLocaleString()}</p>
      <div className="prose text-xl" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
};

export default BlogViewer;
