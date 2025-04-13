import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Color palette with faint shades
const COLORS = [
  '#fff3cd', // light yellow
  '#e3f2fd', // light blue
  '#f8bbd0', // light pink
  '#e8f5e9', // light green
  '#e0f7fa', // light cyan
  '#fff8e1', // light orange
  '#f3e5f5', // light purple
  '#f5f5f5', // light gray
];

const Forum = () => {
  const navigate = useNavigate();
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    type: 'Customer',
    description: ''
  });
  const [error, setError] = useState(null);

  // Get a random color from the palette
  const getRandomColor = useMemo(() => {
    return () => COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  const fetchForums = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forums');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch forums');
      }
      const data = await response.json();
      setForums(data);
    } catch (error) {
      console.error('Error fetching forums:', error);
      setError('Failed to fetch forums. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      const data = await response.json();
      setForums([data, ...forums]);
      setOpenDialog(false);
      setNewPost({ title: '', type: 'Customer', description: '' });
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create forum post. Please try again.');
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" gutterBottom>
              Gaming Forums
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
              Create New Post
            </Button>
          </Box>

          <Grid container spacing={3}>
            {forums.length > 0 ? (
              forums.map((forum) => (
                <Grid item xs={12} md={6} key={forum.Forum_ID}>
                  <Card sx={{ 
                    backgroundColor: getRandomColor(),
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}>
                    {/* Dark overlay for better text visibility */}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 0
                      }}
                    />
                    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                        {forum.Title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ color: '#ffffff' }}>
                        Type: {forum.Type}
                      </Typography>
                      <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
                        {forum.Description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ color: '#ffffff' }}>
                        Analytics: {forum.Analytics}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ position: 'relative', zIndex: 1 }}>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/forum/${forum.Forum_ID}`)}
                        sx={{ color: '#ffffff' }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" align="center" color="text.secondary">
                No forums found. Create a new forum to start the discussion!
              </Typography>
            )}
          </Grid>
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Forum</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={newPost.type}
                onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                label="Type"
                required
              >
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Publisher">Publisher</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPost.title || !newPost.type || !newPost.description}
          >
            Create Forum
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Forum;
