import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  ShoppingCart as CartIcon,
  ReceiptLong as OrdersIcon
} from '@mui/icons-material';
import { getCustomers } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load customers');
        setLoading(false);
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on search term
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.Billing_Email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
    
    // Reset pagination when search changes
    setPage(0);
  }, [searchTerm, customers]);

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

  // Get payment method color
  const getPaymentMethodColor = (method) => {
    const colors = {
      'Credit': '#2196f3',
      'Debit': '#4caf50',
      'UPI': '#ff9800',
      'PayPal': '#9c27b0'
    };
    
    return colors[method] || '#9e9e9e';
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
      <Typography variant="h4" gutterBottom>Customers</Typography>
      
      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search customers by name or email"
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
      
      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customers table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
                <TableRow key={customer.Customer_ID} hover>
                  <TableCell>{customer.Customer_ID}</TableCell>
                  <TableCell>{customer.Name}</TableCell>
                  <TableCell>{customer.Billing_Email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={customer.Payment_Method} 
                      size="small" 
                      sx={{ 
                        bgcolor: getPaymentMethodColor(customer.Payment_Method),
                        color: 'white'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      component={Link} 
                      to={`/customers/${customer.Customer_ID}`}
                      color="primary"
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    
                    <IconButton 
                      component={Link} 
                      to={`/cart/${customer.Customer_ID}`}
                      color="secondary"
                      title="View Cart"
                    >
                      <CartIcon />
                    </IconButton>
                    
                    <IconButton 
                      component={Link} 
                      to={`/orders/${customer.Customer_ID}`}
                      color="default"
                      title="View Orders"
                    >
                      <OrdersIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No customers found
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
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default Customers; 