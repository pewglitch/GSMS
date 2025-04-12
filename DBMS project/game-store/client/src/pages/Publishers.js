import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Button,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getPublishers, getGames } from '../services/api';

const Publishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [games, setGames] = useState([]);
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [publisherGameCounts, setPublisherGameCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publishersData, gamesData] = await Promise.all([
          getPublishers(),
          getGames()
        ]);
        
        setPublishers(publishersData);
        setFilteredPublishers(publishersData);
        setGames(gamesData);
        
        // Calculate game counts per publisher
        const counts = {};
        gamesData.forEach(game => {
          if (!counts[game.Publisher_ID]) {
            counts[game.Publisher_ID] = 0;
          }
          counts[game.Publisher_ID]++;
        });
        setPublisherGameCounts(counts);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load publishers');
        setLoading(false);
        console.error('Error fetching publishers:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter publishers based on search term
    if (searchTerm.trim() === '') {
      setFilteredPublishers(publishers);
    } else {
      const filtered = publishers.filter(
        (publisher) =>
          publisher.License_Number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          publisher.Type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPublishers(filtered);
    }
    
    // Reset pagination when search changes
    setPage(0);
  }, [searchTerm, publishers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get games for a specific publisher
  const getPublisherGames = (publisherId) => {
    return games.filter(game => game.Publisher_ID === publisherId);
  };

  // Get publisher type color
  const getPublisherTypeColor = (type) => {
    return type === 'Company' ? '#1976d2' : '#ff9800';
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
      <Typography variant="h4" gutterBottom>Publishers</Typography>
      
      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search publishers by license number or type"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Dashboard Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5">
                      {publishers.filter(p => p.Type === 'Company').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Companies
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon fontSize="large" color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5">
                      {publishers.filter(p => p.Type === 'Individual').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Individuals
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2, bgcolor: '#4caf50', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" color="white">T</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5">
                      {publishers.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Publishers
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2, bgcolor: '#f44336', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" color="white">A</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5">
                      {games.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Games
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Publishers Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="publishers table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Games Published</TableCell>
              <TableCell>Top Game</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPublishers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((publisher) => {
                const publisherGames = getPublisherGames(publisher.Publisher_ID);
                const topGame = publisherGames.length > 0 
                  ? publisherGames.sort((a, b) => b.Rating - a.Rating)[0]
                  : null;
                
                return (
                  <TableRow key={publisher.Publisher_ID} hover>
                    <TableCell>{publisher.Publisher_ID}</TableCell>
                    <TableCell>{publisher.License_Number}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={publisher.Type === 'Company' ? <BusinessIcon /> : <PersonIcon />}
                        label={publisher.Type} 
                        size="small" 
                        sx={{ 
                          bgcolor: getPublisherTypeColor(publisher.Type),
                          color: 'white'
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      {publisherGameCounts[publisher.Publisher_ID] || 0}
                    </TableCell>
                    <TableCell>
                      {topGame ? (
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {topGame.Title}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              {topGame.Genre}
                            </Typography>
                            <Typography variant="caption" fontWeight="bold">
                              Rating: {topGame.Rating}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No games published
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            
            {filteredPublishers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No publishers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPublishers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default Publishers; 