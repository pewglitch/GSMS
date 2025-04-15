import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const Forum = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    type: 'Customer',
    description: '',
    blog_type: 'User',
    rating: 0
  });

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forum');
      if (!response.ok) {
        throw new Error('Failed to fetch forums');
      }
      const data = await response.json();
      setForums(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForum = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForum),
      });

      if (!response.ok) {
        throw new Error('Failed to create forum');
      }

      const createdForum = await response.json();
      setForums([...forums, createdForum]);
      setOpenDialog(false);
      setNewForum({
        title: '',
        type: 'Customer',
        description: '',
        blog_type: 'User',
        rating: 0
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Game Discussion Forums
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Create New Forum
        </Button>
      </Box>

      <Grid container spacing={3}>
        {forums.map((forum) => (
          <Grid item xs={12} key={forum.forum_id}>
            <Card>
              <CardHeader
                title={forum.title}
                subheader={`Type: ${forum.type} | Blog Type: ${forum.blog_type}`}
              />
              <CardContent>
                <Box mb={2}>
                  <Rating value={forum.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    Upvote/Downvote Ratio: {forum.upvote_downvote_ratio}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {forum.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analytics: {forum.analytics}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Forum</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newForum.title}
              onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Forum Type</InputLabel>
              <Select
                value={newForum.type}
                label="Forum Type"
                onChange={(e) => setNewForum({ ...newForum, type: e.target.value })}
              >
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Publisher">Publisher</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              value={newForum.description}
              onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Blog Type</InputLabel>
              <Select
                value={newForum.blog_type}
                label="Blog Type"
                onChange={(e) => setNewForum({ ...newForum, blog_type: e.target.value })}
              >
                <MenuItem value="Moderator">Moderator</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Publisher">Publisher</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={newForum.rating}
                onChange={(e, newValue) => setNewForum({ ...newForum, rating: newValue })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateForum} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Forum; 