import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Card,
  CardContent,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function Blog() {
  const [tab, setTab] = useState('mine');
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchBlogs = () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const url = tab === 'mine'
      ? 'http://localhost:5000/api/blogs/mine'
      : 'http://localhost:5000/api/blogs/public';

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Failed to fetch blogs', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsPosting(false);
      return;
    }

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
        setSnackbar({ open: true, message: 'Blog posted successfully!', severity: 'success' });
        setTitle('');
        setContent('');
        setIsPublic(true);
        if (tab === 'mine') {
          setBlogs(prev => [data, ...prev]);
        }
      } else {
        setSnackbar({ open: true, message: data.error || 'Failed to post blog', severity: 'error' });
      }
    } catch (err) {
      console.error('Error posting blog', err);
      setSnackbar({ open: true, message: 'An unexpected error occurred.', severity: 'error' });
    } finally {
      setIsPosting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          📝 Blog Page
        </Typography>
        <Button
          component={RouterLink}
          to="/home"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to Home
        </Button>
      </Box>

      {/* New Blog Form */}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Create a New Post</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Blog Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Write your blog here..."
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={<Checkbox checked={isPublic} onChange={() => setIsPublic(!isPublic)} />}
              label="Make Public"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isPosting}
              startIcon={isPosting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isPosting ? 'Posting...' : 'Post Blog'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} aria-label="blog tabs">
          <Tab label="My Blogs" value="mine" />
          <Tab label="Public Blogs" value="public" />
        </Tabs>
      </Box>

      {/* Blog List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {isLoading ? (
          <CircularProgress sx={{ mx: 'auto', my: 4 }} />
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <Card key={blog._id} variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  By {blog.username} on {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {blog.content}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            No blog posts found in this category.
          </Typography>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
