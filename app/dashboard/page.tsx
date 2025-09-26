"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Comment {
  id: number;
  comments: string;
  user: User;
  created_at: string;
  likes_count: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  created_at: string;
  likes_count: number;
  comments?: Comment[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});

  const fetchPosts = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setPosts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchPosts(search);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLike = async (postId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    fetchPosts(search);
  };


  const handleComment = async (postId: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comments: commentText[postId] }),
      });
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts(search);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentLike = async (commentId: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchPosts(search);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard/create")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            + New Post
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && <p>Loading posts...</p>}

      {/* List posts */}
      <div className="space-y-4">
        {posts.map((post) => {
          const formattedDate = dayjs(post.created_at).format("DD MMM YYYY HH:mm");
          return (
            <div
              key={post.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                by {post.user?.name || "Unknown"} • {formattedDate}
              </p>

              {/* Like button */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => handleLike(post.id)}
                  className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm"
                >
                  ❤️ Like
                </button>
                <span>{post.likes_count} likes</span>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Comments</h3>
                {post.comments && post.comments.length > 0 ? (
                  <ul className="space-y-2">
                    {post.comments.map((c) => (
                      <li key={c.id} className="border rounded-lg p-2">
                        <p className="text-sm">{c.comments}</p>
                        <p className="text-xs text-gray-500">
                          by {c.user?.name || "Anonymous"} • {dayjs(c.created_at).format("DD MMM YYYY HH:mm")}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => handleCommentLike(c.id)}
                            className="px-2 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs"
                          >
                            ❤️ Like
                          </button>
                          <span className="text-xs text-gray-600">{c.likes_count} likes</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet</p>
                )}

                {/* Add comment form */}
                <div className="flex mt-3">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    className="flex-1 border rounded-l-lg px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="bg-green-600 text-white px-3 rounded-r-lg text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && posts.length === 0 && (
        <p className="text-gray-500">No posts found.</p>
      )}
    </div>
  );
}
