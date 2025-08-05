import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Container, Box, Typography, Button, IconButton, Avatar,
  Card, CardHeader, CardMedia, CardContent, CardActions, Snackbar, Alert,
  BottomNavigation, BottomNavigationAction, Paper
} from '@mui/material';
import {
  Home as HomeIcon, Star as StarIcon, AddPhotoAlternate as UploadIcon,
  Notifications as BellIcon, Person as UserIcon,
  Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon, Share as ShareIcon
} from '@mui/icons-material';

export default function Following() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5000/api/posts/following');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load following posts:', err);
      }
    }

    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ pb: 7 }}>
      {/* AppBar */}
      <AppBar position="sticky" sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'primary.main' }}
            >
              ThreadRate
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2 }}>
              <Button component={RouterLink} to="/home" color="inherit">Discover</Button>
              <Button component={RouterLink} to="/following" color="inherit">Following</Button>
              <Button component={RouterLink} to="/blog" color="inherit">Blog</Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/upload"
                variant="contained"
                startIcon={<UploadIcon />}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
              >
                Post Outfit
              </Button>
              <IconButton>
                <Avatar sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Header */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Outfits from People You Follow
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore fashion from users you've connected with.
          </Typography>
        </Box>

        {/* Posts */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {posts.length === 0 ? (
            <Typography align="center" color="text.secondary">
              You're not following anyone yet, or no new posts available.
            </Typography>
          ) : (
            posts.map((post) => (
              <Card key={post._id} variant="outlined">
                <CardHeader
                  avatar={<Avatar>{post.username?.charAt(0).toUpperCase()}</Avatar>}
                  title={<Typography fontWeight="bold">{post.username}</Typography>}
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
                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Box>
                    <IconButton onClick={() => handleLike(post._id)}>
                      {likedPosts.has(post._id)
                        ? <FavoriteIcon color="error" />
                        : <FavoriteBorderIcon />}
                    </IconButton>
                    <IconButton><CommentIcon /></IconButton>
                    <IconButton><ShareIcon /></IconButton>
                  </Box>
                  <Button size="small" variant="outlined">Rate Outfit</Button>
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      </Container>

      {/* Mobile Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'block', md: 'none' }
        }}
        elevation={3}
      >
        <BottomNavigation showLabels>
          <BottomNavigationAction label="Discover" icon={<HomeIcon />} component={RouterLink} to="/home" />
          <BottomNavigationAction label="Following" icon={<StarIcon />} component={RouterLink} to="/following" />
          <BottomNavigationAction label="Blog" icon={<BellIcon />} component={RouterLink} to="/blog" />
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
