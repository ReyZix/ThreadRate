import React, { useState, useEffect } from 'react';
import {
  FaHome, FaStar, FaUser, FaBell, FaUpload, FaHeart, FaComment, FaShare
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const StarRating = ({ postId, currentRating, onRate }) => {
  const [hover, setHover] = useState(null);

  const handleClick = async (rating) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: rating }),
      });
      if (res.ok) onRate(rating);
    } catch (err) {
      console.error('Failed to rate post', err);
    }
  };

  return (
    <div className="flex gap-1 items-center mt-2">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <FaStar
            key={i}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            className={`cursor-pointer transition-colors duration-150 ${
              (hover || currentRating) >= ratingValue
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        );
      })}
      <span className="text-sm font-medium ml-2">{currentRating} / 5</span>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [postRatings, setPostRatings] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        const data = await res.json();
        setPosts(data);
        const ratingsMap = Object.fromEntries(
          data.map(p => [p._id, average(p.ratings || [])])
        );
        setPostRatings(ratingsMap);
      } catch (err) {
        console.error('Failed to load posts:', err);
      }
    }
    fetchPosts();
  }, []);

  const average = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r.value || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

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

  const handleFollow = async (userIdToFollow) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/follow/${userIdToFollow}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Follow failed');
      } else {
        alert(`You are now following ${data.followed}`);
      }
    } catch (err) {
      console.error('Follow error', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-accent">
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ThreadRate
          </h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/home"><button className="text-foreground hover:text-primary transition-colors">Discover</button></Link>
            <Link to="/Following"><button className="text-foreground hover:text-primary transition-colors">Following</button></Link>
            <Link to="/Trending"><button className="text-foreground hover:text-primary transition-colors">Trending</button></Link>
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Discover Amazing Fashion</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Rate, discover, and share the latest fashion trends with our community of style enthusiasts
          </p>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Be the first to upload!</p>
          ) : (
            posts.map((post) => (
              <article
                key={post._id}
                className="bg-card rounded-xl shadow-fashion border border-border overflow-hidden hover:shadow-glow transition-all duration-300"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-white bg-primary">
                      {post.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{post.username}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                    {post.userId !== currentUserId && (
                      <button
                        className="text-sm text-primary border border-primary px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
                        onClick={() => handleFollow(post.userId)}
                      >
                        Follow
                      </button>
                    )}
                  </div>

                  <h4 className="text-xl font-bold text-foreground mb-2">{post.title}</h4>
                  <p className="text-muted-foreground">{post.description}</p>
                </div>

              <div className="w-full h-[320px] overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-[320px] h-[320px] object-cover hover:scale-105 transition-transform duration-500 rounded-lg"
                  style={{ maxWidth: '50%', maxHeight: '50%' }}
                />
              </div>



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
                        <span className="font-medium">{likedPosts.has(post._id) ? 1 : 0}</span>
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
                  </div>

                  <StarRating
                    postId={post._id}
                    currentRating={postRatings[post._id] || 0}
                    onRate={(newRating) => {
                      setPostRatings(prev => ({ ...prev, [post._id]: newRating }));
                    }}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </main>

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
