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
      query: `SELECT 
      g.Title AS Game_Title, 
      g.Rating, 
      p.Publisher_ID, 
      p.License_Number, 
      COALESCE(COUNT(cg.Game_ID), 0) AS Total_Purchases
  FROM Game g
  JOIN Publisher p ON g.Publisher_ID = p.Publisher_ID
  LEFT JOIN Cart_Game cg ON g.Game_ID = cg.Game_ID
  WHERE g.Genre = 'RPG'
  GROUP BY g.Game_ID, g.Title, g.Rating, p.Publisher_ID, p.License_Number;`
    },
    {
      name: 'Query 2',
      query: `SELECT p.Publisher_ID, p.License_Number, total_revenue
  FROM Publisher p
  JOIN (
      SELECT g.Publisher_ID, SUM(c.Total) AS total_revenue
      FROM Game g
      JOIN Cart c ON g.Game_ID = c.Cart_ID
      GROUP BY g.Publisher_ID
  ) revenue_per_publisher ON p.Publisher_ID = revenue_per_publisher.Publisher_ID
  WHERE total_revenue = (
      SELECT MAX(total_revenue)
      FROM (
          SELECT SUM(c.Total) AS total_revenue
          FROM Game g
          JOIN Cart c ON g.Game_ID = c.Cart_ID
          GROUP BY g.Publisher_ID
      ) subquery
  );`
    },
    {
      name: 'Query 3',
      query: `SELECT c.Customer_ID, c.Name, SUM(o.Total) AS Total_Spent
  FROM Customer c
  JOIN Orders o ON c.Customer_ID = o.Customer_ID
  GROUP BY c.Customer_ID, c.Name
  HAVING SUM(o.Total) > (
      SELECT AVG(Total) FROM Orders
  );`
    },
    {
      name: 'Query 4',
      query: `SELECT p.Publisher_ID, p.License_Number, p.Type
  FROM Publisher p
  WHERE p.Publisher_ID NOT IN (
      SELECT DISTINCT g.Publisher_ID FROM Game g
  );`
    },
    {
      name: 'Query 5',
      query: `SELECT c.Customer_ID, c.Name, COUNT(o.Order_ID) AS Total_Orders,
         CASE 
             WHEN COUNT(o.Order_ID) >= 20 THEN 'Loyal'
             ELSE 'Regular'
         END AS Customer_Type
  FROM Customer c
  LEFT JOIN Orders o ON c.Customer_ID = o.Customer_ID
  GROUP BY c.Customer_ID, c.Name;`
    },
    {
      name: 'Query 6',
      query: `SELECT g.Game_ID, g.Title, g.Rating + COUNT(r.Customer_ID) AS Score
  FROM Game g 
  LEFT JOIN Reviews r ON g.Game_ID = r.Game_ID
  GROUP BY g.Game_ID
  ORDER BY Score DESC
  LIMIT 3;`
    },
    {
      name: 'Query 7',
      query: `SELECT Mod_ID, Genre, Issues_resolved
  FROM Moderator
  WHERE Issues_resolved < (
      SELECT AVG(Issues_resolved) FROM Moderator
  );`
    },
    {
      name: 'Query 8',
      query: `SELECT P.Publisher_ID, P.Type
  FROM Publisher P
  LEFT JOIN Game G ON P.Publisher_ID = G.Publisher_ID
  WHERE G.Game_ID IS NULL;`
    },
    {
      name: 'Query 9',
      query: `SELECT Forum_ID, Rating, upvote_downvote_ratio AS ratio
  FROM Blog
  ORDER BY ratio DESC
  LIMIT 5;`
    },
    {
      name: 'Query 10',
      query: `SELECT DISTINCT o.Customer_ID
  FROM Orders o 
  JOIN Game g ON o.Customer_ID = o.Customer_ID
  LEFT JOIN Reviews r ON g.Game_ID = r.Game_ID AND o.Customer_ID = r.Customer_ID
  GROUP BY o.Customer_ID
  HAVING COUNT(DISTINCT g.Game_ID) = COUNT(r.Game_ID);`
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