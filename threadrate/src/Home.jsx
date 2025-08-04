import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Container, Box, Typography, Button, IconButton, Avatar,
  Card, CardHeader, CardMedia, CardContent, CardActions, Rating,
  BottomNavigation, BottomNavigationAction, Paper, Skeleton,
  FormControl, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import {
  Home as HomeIcon, Star as StarIcon, AddPhotoAlternate as UploadIcon,
  Notifications as BellIcon, Person as UserIcon,
  Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon, Share as ShareIcon, Folder as ClosetIcon
} from '@mui/icons-material';

// StarRating component using MUI
const StarRating = ({ postId, currentRating, onRate }) => {
  const handleClick = async (newValue) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: newValue }),
      });
      if (res.ok) onRate(newValue);
    } catch (err) {
      console.error('Failed to rate post', err);
    }
  };

  return (
    <Rating
      name={`rating-${postId}`}
      value={Number(currentRating)}
      precision={0.5}
      onChange={(event, newValue) => {
        handleClick(newValue);
      }}
    />
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [postRatings, setPostRatings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (err) { console.error('Invalid token'); }
    }
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  const average = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r.value || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const handleFollow = async (userIdToFollow, username) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/follow/${userIdToFollow}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setSnackbar({ open: true, message: data.error || 'Follow failed', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: `You are now following ${username}`, severity: 'success' });
      }
    } catch (err) {
      console.error('Follow error', err);
    }
  };

  const handleAddToCloset = async (e, postId) => {
    const category = e.target.value;
    if (!category) return;
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:5000/api/closet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ postId, category })
      });
      setSnackbar({ open: true, message: 'Saved to Closet!', severity: 'success' });
    } catch (err) {
      console.error('Failed to save to Closet', err);
      setSnackbar({ open: true, message: 'Failed to save to closet.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderSkeletons = () => (
    [...Array(3)].map((_, index) => (
      <Card key={index} sx={{ mb: 4 }}>
        <CardHeader
          avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
          title={<Skeleton animation="wave" height={10} width="40%" />}
          subheader={<Skeleton animation="wave" height={10} width="20%" />}
        />
        <Skeleton sx={{ height: 400 }} animation="wave" variant="rectangular" />
        <CardContent>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </CardContent>
      </Card>
    ))
  );

  return (
    <Box sx={{ pb: 7 }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" component={RouterLink} to="/" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'primary.main' }}>
              ThreadRate
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2 }}>
              
              <Button component={RouterLink} to="/following" color="inherit">Following</Button>
              <Button component={RouterLink} to="/blog" color="inherit">Blog</Button>
              <Button component={RouterLink} to="/closet" color="inherit">Closet</Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button component={RouterLink} to="/upload" variant="contained" startIcon={<UploadIcon />} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                Post Outfit
              </Button>
              <IconButton>
                <Avatar sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Discover Amazing Fashion
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Rate, discover, and share the latest trends with our community.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {isLoading ? renderSkeletons() : (
            posts.map((post) => (
              <Card key={post._id} variant="outlined">
                <CardHeader
                  avatar={<Avatar />}
                  action={post.userId !== currentUserId && (
                    <Button size="small" variant="outlined" onClick={() => handleFollow(post.userId, post.username)}>
                      Follow
                    </Button>
                  )}
                  title={<Typography variant="subtitle1" fontWeight="bold">{post.username}</Typography>}
                  subheader={new Date(post.createdAt).toLocaleString()}
                />
                <CardMedia
                  component="img"
                  height="500"
                  image={post.imageUrl}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>{post.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{post.description}</Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 2 }}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <IconButton onClick={() => handleLike(post._id)}>
                        {likedPosts.has(post._id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <IconButton><CommentIcon /></IconButton>
                      <IconButton><ShareIcon /></IconButton>
                    </Box>
                    <FormControl size="small" variant="outlined">
                      <Select defaultValue="" displayEmpty onChange={(e) => handleAddToCloset(e, post._id)}>
                        <MenuItem value="" disabled><em><ClosetIcon sx={{ fontSize: '1rem', mr: 1 }} />Add to Closet</em></MenuItem>
                        <MenuItem value="to-wear">🛍️ To Wear</MenuItem>
                        <MenuItem value="current-favorite">⭐ Current Favorite</MenuItem>
                        <MenuItem value="past-favorite">📦 Past Favorite</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <StarRating
                    postId={post._id}
                    currentRating={postRatings[post._id] || 0}
                    onRate={(newRating) => setPostRatings(prev => ({ ...prev, [post._id]: newRating }))}
                  />
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      </Container>

      {/* Mobile nav */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'block', md: 'none' } }} elevation={3}>
        <BottomNavigation showLabels>
          <BottomNavigationAction label="Discover" icon={<HomeIcon />} />
          <BottomNavigationAction label="Top Rated" icon={<StarIcon />} />
          <BottomNavigationAction component={RouterLink} to="/upload" label="Post" icon={<UploadIcon />} />
          <BottomNavigationAction label="Activity" icon={<BellIcon />} />
          <BottomNavigationAction label="Profile" icon={<UserIcon />} />
        </BottomNavigation>
      </Paper>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
