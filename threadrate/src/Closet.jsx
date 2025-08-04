import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Closet() {
  const [closet, setCloset] = useState([]);

  const fetchCloset = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/closet', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCloset(data))
      .catch((err) => console.error('Failed to fetch closet items', err));
  };

  useEffect(() => {
    fetchCloset();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">🧥 My Closet</h1>
        <Link to="/home">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            🔙 Back to Home
          </button>
        </Link>
      </div>

      {closet.length === 0 ? (
        <p className="text-gray-500">No saved posts yet.</p>
      ) : (
        <div className="space-y-6">
          {['to-wear', 'current-favorite', 'past-favorite'].map((category) => (
            <div key={category}>
              <h2 className="text-xl font-semibold capitalize mb-2">
                {category.replace('-', ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {closet
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div key={item._id} className="border p-4 rounded shadow-sm bg-card">
                      {/* IMAGE BLOCK (copied/resized like Home.jsx) */}
                      <div className="w-full h-[320px] overflow-hidden bg-gray-100 flex items-center justify-center mb-3">
                        <img
                          src={item.post.imageUrl}
                          alt={item.post.title}
                          className="w-[320px] h-[320px] object-cover hover:scale-105 transition-transform duration-500 rounded-lg"
                          style={{ maxWidth: '50%', maxHeight: '50%' }}
                        />
                      </div>

                      <h3 className="font-bold text-lg text-foreground">{item.post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.post.description}</p>

                      {/* MOVE DROPDOWN */}
                      <select
                        onChange={async (e) => {
                          const newCategory = e.target.value;
                          const token = localStorage.getItem('token');
                          await fetch('http://localhost:5000/api/closet', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              postId: item.post._id,
                              category: newCategory
                            })
                          });
                          fetchCloset(); // Refresh after moving
                        }}
                        defaultValue={item.category}
                        className="mt-2 border border-border px-3 py-1 rounded text-sm bg-white text-gray-700"
                      >
                        <option value="to-wear">🛍️ To Wear</option>
                        <option value="current-favorite">⭐ Current Favorite</option>
                        <option value="past-favorite">📦 Past Favorite</option>
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
