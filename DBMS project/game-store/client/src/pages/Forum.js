import React, { useState, useEffect } from 'react';
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
  Rating,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forums');
      if (!response.ok) {
        throw new Error('Failed to fetch forums');
      }
      const data = await response.json();
      setForums(data);
    } catch (error) {
      console.error('Error:', error);
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
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      setForums(prevForums => [data.forum, ...prevForums]);
      setOpenDialog(false);
      setNewPost({ title: '', type: 'Customer', description: '' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRatingChange = async (forumId, newValue) => {
    try {
      const response = await fetch(`http://localhost:5000/api/forums/${forumId}/rating`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: newValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rating');
      }

      const data = await response.json();
      setForums(prevForums => 
        prevForums.map(forum => 
          forum.Forum_ID === forumId ? data.forum : forum
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Gaming Forums
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Create New Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {forums.map((forum) => (
          <Grid item xs={12} md={6} key={forum.Forum_ID}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {forum.Title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Posted by: {forum.Type}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" paragraph>
                  {forum.Description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography component="legend">Rating:</Typography>
                  <Rating
                    value={forum.Rating || 0}
                    precision={0.5}
                    onChange={(event, newValue) => handleRatingChange(forum.Forum_ID, newValue)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({forum.Rating ? forum.Rating.toFixed(1) : '0.0'})
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Typography variant="body2" color="text.secondary">
                  Analytics: {forum.Analytics}
                </Typography>
                {forum.Upvote_Downvote_Ratio > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    Ratio: {forum.Upvote_Downvote_Ratio.toFixed(2)}
                  </Typography>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Forum Post</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={newPost.type}
                label="Type"
                onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPost.title || !newPost.description}
          >
            Create Post
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Forum;
