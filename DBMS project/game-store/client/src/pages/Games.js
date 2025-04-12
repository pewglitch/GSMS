import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import { getGames } from '../services/api';
import { useCart } from '../context/CartContext';

const Games = () => {
  const { addToCart } = useCart();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');
  const [genres, setGenres] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getGames();
        setGames(data);
        setFilteredGames(data);
        
        // Extract unique genres
        const uniqueGenres = [...new Set(data.map(game => game.Genre))];
        setGenres(uniqueGenres);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load games');
        setLoading(false);
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    // Filter games based on search term and genre
    let result = games;
    
    if (searchTerm) {
      result = result.filter(game => 
        game.Title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (genreFilter) {
      result = result.filter(game => game.Genre === genreFilter);
    }
    
    // Sort by price
    if (priceSort === 'asc') {
      result = [...result].sort((a, b) => a.Price - b.Price);
    } else if (priceSort === 'desc') {
      result = [...result].sort((a, b) => b.Price - a.Price);
    }
    
    setFilteredGames(result);
  }, [searchTerm, genreFilter, priceSort, games]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenreFilter(event.target.value);
  };

  const handlePriceSortChange = (event) => {
    setPriceSort(event.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setGenreFilter('');
    setPriceSort('');
    setFilteredGames(games);
  };

  // Generate placeholder image URL based on game title
  const getGameImageUrl = (title, genre) => {
    const baseUrl = 'https://via.placeholder.com/300x200';
    const text = `${title.substring(0, 10)}...`;
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

  const handleAddToCart = (game) => {
    addToCart(game);
    setSnackbar({
      open: true,
      message: `${game.Title} added to cart!`
    });
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Games Catalog</Typography>
      
      {/* Filters Section */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Games"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Genre</InputLabel>
              <Select
                value={genreFilter}
                onChange={handleGenreChange}
                label="Filter by Genre"
              >
                <MenuItem value="">
                  <em>All Genres</em>
                </MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort by Price</InputLabel>
              <Select
                value={priceSort}
                onChange={handlePriceSortChange}
                label="Sort by Price"
              >
                <MenuItem value="">
                  <em>No Sorting</em>
                </MenuItem>
                <MenuItem value="asc">Price: Low to High</MenuItem>
                <MenuItem value="desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={resetFilters}
              sx={{ height: '56px' }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          Showing {filteredGames.length} of {games.length} games
        </Typography>
      </Box>
      
      {/* Games Grid */}
      <Grid container spacing={3}>
        {filteredGames.map((game) => (
          <Grid item key={game.Game_ID} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={getGameImageUrl(game.Title, game.Genre)}
                alt={game.Title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap title={game.Title}>
                  {game.Title}
                </Typography>
                <Chip 
                  label={game.Genre} 
                  size="small" 
                  sx={{ 
                    bgcolor: `#${getColorForGenre(game.Genre)}`, 
                    color: 'white',
                    mb: 1
                  }} 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={game.Rating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({game.Rating})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary">
                  ${Number(game.Price).toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  component={Link} 
                  to={`/games/${game.Game_ID}`}
                >
                  View Details
                </Button>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleAddToCart(game)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {filteredGames.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">No games found</Typography>
          <Typography variant="body1">Try changing your search or filters</Typography>
        </Box>
      )}

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

export default Games; 