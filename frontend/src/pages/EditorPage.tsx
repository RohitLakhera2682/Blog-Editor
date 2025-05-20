import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useBlogById } from "../hooks/useBlogById";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import axios from "axios";

const EditorPage: React.FC = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { blog, loading } = useBlogById(id || "");
  const navigate = useNavigate();
  const { authHeader } = useAuth();
  const {success,error} = useToast();
  const [blogId, setBlogId] = useState<number | null>(id ? Number(id) : null);


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  // Populate fields when blog is fetched
  useEffect(() => {
    if (blog && isEditing) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setTags(Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "");
    }
  }, [blog, isEditing]);

const saveDraft = async () => {
  if (!title && !content && !tags) return;

  try {
    const response = await axios.post(
      "http://localhost:5000/api/blogs/save-draft",
      {
        id: blogId, // use state instead of useParams directly
        title,
        content,
        tags,
      },
      { headers: authHeader }
    );

    const returnedId = response.data?.id || response.data?.blogId;

    if (!blogId && returnedId) {
      setBlogId(returnedId);
      // Optional: update the URL without reloading the page
      window.history.replaceState(null, "", `/editor/${returnedId}`);
    }

    success("Draft auto-saved");
    
  } catch (err) {
    error("Auto-save failed");
  }
};




  const publish = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/blogs/publish",
         {
            id: blogId,
            title,
            content,
            tags,
          },
          { headers: authHeader }
      );
      success("Blog published");
      navigate("/blogs");
    } catch (err) {
      error("Failed to publish");
    }
  };

  useDebouncedEffect(
  () => {
    if (title || content || tags) {
      saveDraft();
    }
  },
  [title, content, tags],
  5000,
  !isEditing || (isEditing && !loading) // only run when not loading if editing
);


  return (
    <div className="max-w-3xl mx-auto p-6">
      {isEditing && loading ? (
        <p>Loading blog...</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? "Edit Blog" : "New Blog"}
          </h1>

          <input
            id="title"
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />

          <textarea
            id="content"
            placeholder="Write your content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full border p-2 mb-4 rounded"
          />

          <input
            id="tags"
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />

          <div className="flex gap-4">
            <button
              onClick={() => {saveDraft();navigate("/blogs");}}
              className="bg-yellow-400 px-4 py-2 rounded"
            >
              Save as Draft
            </button>

            <button
              onClick={publish}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Publish
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditorPage;
