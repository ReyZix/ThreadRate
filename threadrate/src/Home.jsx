import React, { useState } from 'react';
import { FaHome, FaStar, FaUser, FaBell, FaCog, FaUpload, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const fashionPosts = [
  {
    id: 1,
    user: 'StyleQueen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c01c?w=50&h=50&fit=crop&crop=face',
    title: 'Summer Vibes Outfit',
    description: 'Loving this casual summer look! Perfect for brunch with friends 🌞',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
    rating: 4.8,
    likes: 127,
    comments: 23,
    time: '2h ago'
  },
  {
    id: 2,
    user: 'FashionForward',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    title: 'Street Style Excellence',
    description: 'Urban chic meets comfort. This jacket is everything! 🔥',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    rating: 4.9,
    likes: 89,
    comments: 15,
    time: '4h ago'
  },
  {
    id: 3,
    user: 'TrendSetter',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    title: 'Elegant Evening Look',
    description: 'Ready for tonight\'s dinner party. Feeling glamorous ✨',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
    rating: 4.7,
    likes: 203,
    comments: 31,
    time: '6h ago'
  },
  {
    id: 4,
    user: 'MinimalChic',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    title: 'Minimalist Monday',
    description: 'Sometimes less is more. Clean lines and neutral tones 🤍',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    rating: 4.6,
    likes: 156,
    comments: 19,
    time: '8h ago'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState(new Set());

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
            <button className="text-foreground hover:text-primary transition-colors">Trending</button>
            <button className="text-foreground hover:text-primary transition-colors">Following</button>
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
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Discover Amazing Fashion
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Rate, discover, and share the latest fashion trends with our community of style enthusiasts
          </p>
        </div>

        {/* Fashion Feed */}
        <div className="space-y-8">
          {fashionPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-card rounded-xl shadow-fashion border border-border overflow-hidden hover:shadow-glow transition-all duration-300"
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={post.avatar} 
                    alt={post.user}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{post.user}</h3>
                    <p className="text-sm text-muted-foreground">{post.time}</p>
                  </div>
                  <StarRating rating={post.rating} />
                </div>
                
                <h4 className="text-xl font-bold text-foreground mb-2">{post.title}</h4>
                <p className="text-muted-foreground">{post.description}</p>
              </div>

              {/* Post Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Post Actions */}
              <div className="p-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        likedPosts.has(post.id) 
                          ? 'text-red-500' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <FaHeart className={likedPosts.has(post.id) ? 'fill-current' : ''} />
                      <span className="font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <FaComment />
                      <span className="font-medium">{post.comments}</span>
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
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gradient-primary text-primary-foreground px-8 py-3 rounded-lg hover:shadow-glow transition-all duration-300 font-medium">
            Load More Posts
          </button>
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
