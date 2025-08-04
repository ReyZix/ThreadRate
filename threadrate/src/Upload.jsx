import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Paper, Typography, Button, TextField,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export default function Upload() {
  const [image, setImage] = useState(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  async function handlePost() {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({ open: true, message: 'You must be logged in to post.', severity: 'error' });
      return;
    }

    if (!image || !subject) {
      setSnackbar({ open: true, message: 'Please select an image and enter a title.', severity: 'warning' });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'ThreadRateImages'); // Cloudinary preset

    try {
      const cloudinaryRes = await fetch(
        'https://api.cloudinary.com/v1_1/dpuk8eew3/image/upload',
        { method: 'POST', body: formData }
      );
      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      if (!imageUrl) {
        throw new Error('Image upload failed.');
      }

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: subject,
          description,
          imageUrl,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, message: 'Upload successful! Redirecting...', severity: 'success' });
        setImage(null);
        setSubject('');
        setDescription('');
        setTimeout(() => navigate('/home'), 2000);
      } else {
        throw new Error(result.error || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || 'An error occurred.', severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Header with Back to Home */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Upload an Outfit
          </Typography>
          <Button
            component={RouterLink}
            to="/home"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Home
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Share your latest look with the ThreadRate community.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Image Upload Button and Preview */}
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
            }}
          >
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                Select Image
              </Button>
            </label>
            {image ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Image Preview:
                </Typography>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ mt: 2, color: 'text.secondary' }}>
                <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                <Typography>No image selected</Typography>
              </Box>
            )}
          </Box>

          {/* Text Fields */}
          <TextField
            label="Title / Subject"
            variant="outlined"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <TextField
            label="Description (optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Post Button */}
          <Button
            onClick={handlePost}
            variant="contained"
            size="large"
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ py: 1.5 }}
          >
            {isUploading ? 'Uploading...' : 'Post Outfit'}
          </Button>
        </Box>
      </Paper>

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
