import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: '120px'
}));

const Query = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const presetQueries = [
    {
      name: 'Query 1',
      query: 'SELECT * FROM Customer LIMIT 5;'
    },
    {
      name: 'Query 2',
      query: 'SELECT Game_ID, Title, Price FROM Game ORDER BY Price DESC LIMIT 5;'
    },
    {
      name: 'Query 3',
      query: 'SELECT Publisher_ID, COUNT(*) as GameCount FROM Game GROUP BY Publisher_ID LIMIT 5;'
    },
    {
      name: 'Query 4',
      query: 'SELECT c.Name, COUNT(o.Order_ID) as OrderCount FROM Customer c LEFT JOIN Orders o ON c.Customer_ID = o.Customer_ID GROUP BY c.Customer_ID LIMIT 5;'
    },
    {
      name: 'Query 5',
      query: 'SELECT g.Title, COUNT(od.Order_ID) as TimesSold FROM Game g LEFT JOIN OrderDetails od ON g.Game_ID = od.Game_ID GROUP BY g.Game_ID ORDER BY TimesSold DESC LIMIT 5;'
    },
    {
      name: 'Query 6',
      query: 'SELECT AVG(Price) as AvgPrice, Genre FROM Game GROUP BY Genre;'
    },
    {
      name: 'Query 7',
      query: 'SELECT Payment_Method, COUNT(*) as UseCount FROM Orders GROUP BY Payment_Method;'
    },
    {
      name: 'Query 8',
      query: 'SELECT c.Name, SUM(o.Total) as TotalSpent FROM Customer c JOIN Orders o ON c.Customer_ID = o.Customer_ID GROUP BY c.Customer_ID ORDER BY TotalSpent DESC LIMIT 5;'
    },
    {
      name: 'Query 9',
      query: 'SELECT MONTH(OrderDate) as Month, COUNT(*) as OrderCount FROM Orders GROUP BY MONTH(OrderDate);'
    },
    {
      name: 'Query 10',
      query: 'SELECT g.Title, g.Price, g.Genre FROM Game g WHERE g.Price > (SELECT AVG(Price) FROM Game) ORDER BY g.Price DESC LIMIT 5;'
    }
  ];

  const handleExecuteQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/query', { query });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while executing the query');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results || !results.length) return null;

    const columns = Object.keys(results[0]);

    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          SQL Query Editor
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {presetQueries.map((preset, index) => (
            <StyledButton
              key={index}
              variant="outlined"
              onClick={() => setQuery(preset.query)}
              color="primary"
            >
              {preset.name}
            </StyledButton>
          ))}
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleExecuteQuery}
            disabled={!query.trim() || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Execute Query'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {results && renderResults()}
      </Paper>
    </Container>
  );
};

export default Query;
