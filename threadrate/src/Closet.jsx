import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Inventory2 as InventoryIcon } from '@mui/icons-material';

const Closet = () => {
  const [closet, setCloset] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ['to-wear', 'current-favorite', 'past-favorite'];

  const fetchCloset = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    fetch('http://localhost:5000/api/closet', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCloset(data))
      .catch((err) => console.error('Failed to fetch closet items', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCloset();
  }, []);

  const handleCategoryChange = async (e, item) => {
    const newCategory = e.target.value;
    const token = localStorage.getItem('token');

    await fetch('http://localhost:5000/api/closet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        postId: item.post._id,
        category: newCategory,
      }),
    });

    fetchCloset(); // refresh
  };

  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {[...Array(4)].map((_, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
          <Skeleton variant="text" />
        </Grid>
      ))}
    </Grid>
  );

  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
        Your closet is empty.
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Save posts from the home page to add them here!
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          🧥 My Closet
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

      {isLoading ? renderSkeletons() : closet.length === 0 ? renderEmptyState() : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {categories.map((category) => {
            const items = closet.filter((item) => item.category === category);
            if (items.length === 0) return null;

            return (
              <Box key={category}>
                <Typography variant="h5" component="h2" sx={{ textTransform: 'capitalize', mb: 2 }}>
                  {category.replace('-', ' ')}
                </Typography>
                <Grid container spacing={3}>
                  {items.map((item) => (
                    <Grid item xs={12} md={6} key={item._id}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="250"
                          image={item.post.imageUrl}
                          alt={item.post.title}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div" noWrap>
                            {item.post.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {item.post.description}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2 }}>
                          <FormControl size="small">
                            <Select
                              value={item.category}
                              onChange={(e) => handleCategoryChange(e, item)}
                            >
                              <MenuItem value="to-wear">🛍️ To Wear</MenuItem>
                              <MenuItem value="current-favorite">⭐ Current Favorite</MenuItem>
                              <MenuItem value="past-favorite">📦 Past Favorite</MenuItem>
                            </Select>
                          </FormControl>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default Closet;
