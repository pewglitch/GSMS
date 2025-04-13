import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress 
} from '@mui/material';
import { 
  PeopleAlt as CustomersIcon,
  ShoppingCart as CartIcon,
  SportsEsports as GamesIcon,
  Business as PublishersIcon
} from '@mui/icons-material';
import { getGames, getCustomers, getPublishers } from '../services/api';
<Container
  maxWidth="lg"
  sx={{
    mt: 4,
    mb: 4,
    backgroundImage: 'url("/images/background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: 2,
    padding: 3,
    minHeight: '100vh', // to ensure the image covers the whole viewport height
  }}
></Container>
const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box
              sx={{
                backgroundColor: color,
                height: 56,
                width: 56,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Grid>
          <Grid item>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {title}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesData, customersData, publishersData] = await Promise.all([
          getGames(),
          getCustomers(),
          getPublishers()
        ]);
        
        setGames(gamesData);
        setCustomers(customersData);
        setPublishers(publishersData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error('Dashboard data fetching error:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalGames = games.length;
  const totalCustomers = customers.length;
  const totalPublishers = publishers.length;
  
  // Get genres distribution
  const genres = games.reduce((acc, game) => {
    if (!acc[game.Genre]) {
      acc[game.Genre] = 0;
    }
    acc[game.Genre]++;
    return acc;
  }, {});

  // Get top rated games
  const topGames = [...games]
    .sort((a, b) => b.Rating - a.Rating)
    .slice(0, 5);

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
        <Paper sx={{ p: 3 }}>
          <Typography color="error" variant="h6">{error}</Typography>
          <Typography>Please try again later or contact support.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      
      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Games" 
            value={totalGames} 
            icon={<GamesIcon sx={{ color: '#fff' }} />} 
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Customers" 
            value={totalCustomers} 
            icon={<CustomersIcon sx={{ color: '#fff' }} />} 
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Publishers" 
            value={totalPublishers} 
            icon={<PublishersIcon sx={{ color: '#fff' }} />} 
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Orders" 
            value={25} 
            icon={<CartIcon sx={{ color: '#fff' }} />} 
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Game Genres Distribution */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Game Genres Distribution" />
            <Divider />
            <CardContent>
              {Object.entries(genres).map(([genre, count]) => (
                <Box key={genre} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">{genre}</Typography>
                  <Typography variant="body1" fontWeight="bold">{count}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Top Rated Games */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Top Rated Games" />
            <Divider />
            <CardContent>
              {topGames.map((game) => (
                <Box key={game.Game_ID} sx={{ mb: 2 }}>
                  <Typography variant="h6">{game.Title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {game.Genre} • ${game.Price}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Rating: {game.Rating}/5
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 