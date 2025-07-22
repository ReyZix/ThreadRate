import React, { useState, useEffect } from 'react';
import { FaHome, FaStar, FaUser, FaBell, FaUpload, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load posts:', err);
      }
    }

    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${
              i < Math.floor(rating) 
                ? 'text-yellow-400' 
                : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-sm font-medium ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-accent">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ThreadRate
          </h1>
          
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-foreground hover:text-primary transition-colors">Discover</button>
            <Link to="/Following">
              <button className="text-foreground hover:text-primary transition-colors">Following</button>
            </Link>
            <Link to="/Trending">
              <button className="text-foreground hover:text-primary transition-colors">Trending</button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/upload">
              <button className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg hover:shadow-glow transition-all duration-300 flex items-center gap-2">
                <FaUpload className="text-sm" />
                Post Outfit
              </button>
            </Link>
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <FaUser className="text-primary-foreground text-sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Discover Amazing Fashion</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Rate, discover, and share the latest fashion trends with our community of style enthusiasts
          </p>
        </div>

        {/* Fashion Feed */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Be the first to upload!</p>
          ) : (
            posts.map((post) => (
              <article
                key={post._id}
                className="bg-card rounded-xl shadow-fashion border border-border overflow-hidden hover:shadow-glow transition-all duration-300"
              >
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-white bg-primary">
                      {post.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-foreground mb-2">{post.title}</h4>
                  <p className="text-muted-foreground">{post.description}</p>
                </div>

                {/* Post Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Post Actions */}
                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 transition-colors ${
                          likedPosts.has(post._id)
                            ? 'text-red-500'
                            : 'text-muted-foreground hover:text-red-500'
                        }`}
                      >
                        <FaHeart className={likedPosts.has(post._id) ? 'fill-current' : ''} />
                        <span className="font-medium">
                          {likedPosts.has(post._id) ? 1 : 0}
                        </span>
                      </button>

                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <FaComment />
                        <span className="font-medium">0</span>
                      </button>

                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <FaShare />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>

                    <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
                      Rate Outfit
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3">
        <div className="flex items-center justify-around">
          <FaHome className="text-xl text-primary" />
          <FaStar className="text-xl text-muted-foreground" />
          <FaUpload className="text-xl text-muted-foreground" />
          <FaBell className="text-xl text-muted-foreground" />
          <FaUser className="text-xl text-muted-foreground" />
        </div>
      </nav>
    </div>
  );
}
