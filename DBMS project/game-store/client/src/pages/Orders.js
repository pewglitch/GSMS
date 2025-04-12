import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Box,
  Button,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { getCustomerOrders, getCustomerById } from '../services/api';

const Orders = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        // Fetch customer data and orders data in parallel
        const [customerData, ordersData] = await Promise.all([
          getCustomerById(customerId),
          getCustomerOrders(customerId)
        ]);
        
        setCustomer(customerData);
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load orders data');
        setLoading(false);
        console.error('Error fetching orders data:', error);
      }
    };

    fetchOrdersData();
  }, [customerId]);

  const handleGoBack = () => {
    navigate(-1);
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

  // Calculate total spent
  const calculateTotalSpent = () => {
    return orders.reduce((sum, order) => sum + order.Total, 0);
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
        <Button startIcon={<BackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
          Back
        </Button>
        <Paper sx={{ p: 3 }}>
          <Typography color="error" variant="h6">{error}</Typography>
          <Typography>Failed to load orders data. Please try again later.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<BackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
        Back
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      
      {customer && (
        <Typography variant="subtitle1" gutterBottom>
          Customer: {customer.Name} ({customer.Billing_Email})
        </Typography>
      )}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h3">
                {orders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h3">
                ${calculateTotalSpent().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>No orders found</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This customer hasn't placed any orders yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Billing Email</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.Order_ID} hover>
                  <TableCell>{order.Order_ID}</TableCell>
                  <TableCell>
                    {/* In a real app, you would format the date */}
                    N/A
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.Payment_Method} 
                      size="small" 
                      sx={{ 
                        bgcolor: getPaymentMethodColor(order.Payment_Method),
                        color: 'white'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{order.Billing_Email}</TableCell>
                  <TableCell align="right">${order.Total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Orders; 