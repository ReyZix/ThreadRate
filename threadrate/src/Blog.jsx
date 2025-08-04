import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [tab, setTab] = useState('mine');
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const url = tab === 'mine'
      ? 'http://localhost:5000/api/blogs/mine'
      : 'http://localhost:5000/api/blogs/public';
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Failed to fetch blogs', err));
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, isPublic }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Blog posted successfully');
        setTitle('');
        setContent('');
        setIsPublic(true);
      } else {
        alert(data.error || 'Failed to post blog');
      }
    } catch (err) {
      console.error('Error posting blog', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📝 Blog Page</h1>
        <Link to="/home">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            🔙 Back to Home
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Write your blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded h-40"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          Make Public
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Blog
        </button>
      </form>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === 'mine' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('mine')}
        >
          My Blogs
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'public' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('public')}
        >
          Public Blogs
        </button>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-sm text-gray-600">By {blog.username}</p>
            <p className="mt-2">{blog.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
