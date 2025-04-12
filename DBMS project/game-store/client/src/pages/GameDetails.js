import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Rating,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getGameById } from '../services/api';
import { useCart } from '../context/CartContext';

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [game, setGame] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const gameData = await getGameById(id);
        setGame(gameData);
        
        // For now, we'll use mock reviews data
        // In a real app, you would fetch reviews from the API
        setReviews([
          {
            id: 1,
            customerName: 'John Doe',
            rating: 4.5,
            comment: 'Great game! The graphics are amazing and the story is engaging.',
            date: '2023-01-15'
          },
          {
            id: 2,
            customerName: 'Jane Smith',
            rating: 5,
            comment: 'One of the best games I have ever played. Highly recommended!',
            date: '2023-02-03'
          },
          {
            id: 3,
            customerName: 'Mike Johnson',
            rating: 3.5,
            comment: 'Good game, but could use some improvements in the combat system.',
            date: '2023-03-10'
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        setError(`Failed to load game details for ID: ${id}`);
        setLoading(false);
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...game, quantity });
    setSnackbar({
      open: true,
      message: `${quantity} ${quantity === 1 ? 'copy' : 'copies'} of ${game.Title} added to cart!`
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Generate placeholder image URL based on game title and genre
  const getGameImageUrl = (title, genre) => {
    const baseUrl = 'https://via.placeholder.com/600x400';
    const text = `${title.substring(0, 20)}...`;
    const color = getColorForGenre(genre);
    
    return `${baseUrl}/${color}/FFFFFF?text=${text}`;
  };

  // Get color based on genre
  const getColorForGenre = (genre) => {
    const genreColors = {
      'Action': '4CAF50',
      'RPG': '2196F3',
      'Strategy': 'FF9800',
      'Adventure': '9C27B0',
      'Puzzle': '00BCD4',
      'Horror': '607D8B',
      'Shooter': 'F44336',
      'Sports': '8BC34A',
      'Racing': 'FFC107',
      'Simulation': '795548'
    };
    
    return genreColors[genre] || '9E9E9E';
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  if (error || !game) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button startIcon={<BackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
          Back to Games
        </Button>
        <Paper sx={{ p: 3 }}>
          <Typography color="error" variant="h6">{error || 'Game not found'}</Typography>
          <Typography>The requested game could not be found or there was an error loading the data.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<BackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
        Back to Games
      </Button>
      
      <Grid container spacing={4}>
        {/* Game Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 1,
                objectFit: 'contain'
              }}
              src={getGameImageUrl(game.Title, game.Genre)}
              alt={game.Title}
            />
          </Paper>
        </Grid>
        
        {/* Game Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              {game.Title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={game.Genre} 
                sx={{ 
                  bgcolor: `#${getColorForGenre(game.Genre)}`, 
                  color: 'white',
                  mr: 2
                }} 
              />
              <Rating value={game.Rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({game.Rating})
              </Typography>
            </Box>
            
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              ${Number(game.Price).toFixed(2)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              Experience the thrill of {game.Title}, an immersive {game.Genre} game that will keep you entertained for hours. This game features stunning graphics, engaging gameplay, and a compelling storyline.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Publisher ID: {game.Publisher_ID}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, mr: 2 }}>
                <IconButton size="small" onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  variant="outlined"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{
                    style: { textAlign: 'center', width: '40px', padding: '8px' },
                    min: 1
                  }}
                  sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                />
                <IconButton size="small" onClick={increaseQuantity}>
                  <AddIcon />
                </IconButton>
              </Box>
              
              <Button 
                variant="contained" 
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                sx={{ flexGrow: 1 }}
              >
                Add to Cart
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Reviews Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Customer Reviews
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {reviews.length > 0 ? (
                <List>
                  {reviews.map((review) => (
                    <ListItem key={review.id} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">
                              {review.customerName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {review.date}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                              <Rating value={review.rating} precision={0.5} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                ({review.rating})
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.primary">
                              {review.comment}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No reviews yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GameDetails; 