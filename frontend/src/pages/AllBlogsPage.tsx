import React from "react";
import { useBlogs } from "../hooks/useBlogs";
import { useNavigate } from "react-router-dom"; // or useRouter in Next.js

const AllBlogsPage: React.FC = () => {
  const { blogs, loading } = useBlogs();
  const navigate = useNavigate();

  const published = Array.isArray(blogs)
    ? blogs.filter((b: any) => b.status === "PUBLISHED")
    : [];

  const drafts = Array.isArray(blogs)
    ? blogs.filter((b: any) => b.status === "DRAFT")
    : [];

  const formatDate = (date: string) => new Date(date).toLocaleString();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-4xl font-bold text-gray-800">Your Blogs</h1>
    <button
      onClick={() => navigate("/editor")}
      className="bg-blue-600 text-lg text-white px-5 py-2 rounded-lg transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      New Blog
    </button>
  </div>

  {loading ? (
    <div className="text-center text-gray-500">Loading...</div>
  ) : (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Published</h2>
        {published.length === 0 ? (
          <p className="text-gray-500">No published blogs.</p>
        ) : (
          <ul className="space-y-4">
            {published.map((blog: any) => (
              <li
                key={blog.id}
                className="p-4 border border-gray-200 text-lg rounded-lg hover:bg-gray-50 transition duration-150 cursor-pointer"
                onClick={() => navigate(`/blog/${blog.id}`)}
              >
                <h3 className="font-bold text-gray-800">{blog.title}</h3>
                <p className="text-sm text-gray-500">
                  Published on {formatDate(blog.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Drafts</h2>
        {drafts.length === 0 ? (
          <p className="text-gray-500">No drafts saved.</p>
        ) : (
          <ul className="space-y-4">
            {drafts.map((blog: any) => (
              <li
                key={blog.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150 cursor-pointer"
                onClick={() => navigate(`/editor/${blog.id}`)}
              >
                <h3 className="font-bold text-gray-800">
                  {blog.title || "Untitled Draft"}
                </h3>
                <p className="text-sm text-gray-500">
                  Last edited {formatDate(blog.updatedAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )}
</div>
    // <div className="max-w-4xl mx-auto p-6">
    //   <div className="flex justify-between items-center mb-6">
    //     <h1 className="text-2xl font-bold">Your Blogs</h1>
    //     <button
    //       onClick={() => navigate("/editor")}
    //       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //     >
    //       New Blog
    //     </button>
    //   </div>

    //   {loading ? (
    //     <p>Loading...</p>
    //   ) : (
    //     <>
    //       <section className="mb-8">
    //         <h2 className="text-xl font-semibold mb-2">Published</h2>
    //         {published.length === 0 ? (
    //           <p className="text-gray-500">No published blogs.</p>
    //         ) : (
    //           <ul className="space-y-4">
    //             {published.map((blog: any) => (
    //               <li
    //                 key={blog.id}
    //                 className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
    //                 onClick={() => navigate(`/blog/${blog.id}`)}
    //               >
    //                 <h3 className="font-bold">{blog.title}</h3>
    //                 <p className="text-sm text-gray-500">
    //                   Published on {formatDate(blog.createdAt)}
    //                 </p>
    //               </li>
    //             ))}
    //           </ul>
    //         )}
    //       </section>

    //       <section>
    //         <h2 className="text-xl font-semibold mb-2">Drafts</h2>
    //         {drafts.length === 0 ? (
    //           <p className="text-gray-500">No drafts saved.</p>
    //         ) : (
    //           <ul className="space-y-4">
    //             {drafts.map((blog: any) => (
    //               <li
    //                 key={blog.id}
    //                 className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
    //                 onClick={() => navigate(`/editor/${blog.id}`)}
    //               >
    //                 <h3 className="font-bold">
    //                   {blog.title || "Untitled Draft"}
    //                 </h3>
    //                 <p className="text-sm text-gray-500">
    //                   Last edited {formatDate(blog.updatedAt)}
    //                 </p>
    //               </li>
    //             ))}
    //           </ul>
    //         )}
    //       </section>
    //     </>
    //   )}
    // </div>
  );
};

export default AllBlogsPage;
