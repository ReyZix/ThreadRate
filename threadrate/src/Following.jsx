import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';

export default function Follow() {
  return (
    <>
      {/* Top AppBar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Closet
          </Typography>
          <IconButton color="inherit" component={RouterLink} to="/profile">
            <Avatar />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 2, mb: 8 }}>
        <Typography variant="h5" gutterBottom>
          Following Posts
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Post Title {item}</Typography>
                  <Typography variant="body2">This is a sample post description.</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bottom Navigation */}
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
          <BottomNavigationAction label="Blog" icon={<StarIcon />} component={RouterLink} to="/blog" />
          <BottomNavigationAction label="Closet" icon={<PersonIcon />} component={RouterLink} to="/closet" />
        </BottomNavigation>
      </Paper>
    </>
  );
}
