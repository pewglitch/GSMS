import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  CircularProgress,
  Divider,
  TextField,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (gameId, value) => {
    const newValue = parseInt(value);
    if (!isNaN(newValue) && newValue > 0) {
      updateQuantity(gameId, newValue);
    }
  };

  const increaseQuantity = (gameId) => {
    const currentItem = cartItems.find(item => item.gameId === gameId);
    if (currentItem) {
      updateQuantity(gameId, currentItem.quantity + 1);
    }
  };

  const decreaseQuantity = (gameId) => {
    const currentItem = cartItems.find(item => item.gameId === gameId);
    if (currentItem && currentItem.quantity > 1) {
      updateQuantity(gameId, currentItem.quantity - 1);
    }
  };

  const handleRemoveItem = (gameId) => {
    removeFromCart(gameId);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (Number(item.Price) * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    setLoading(true);
    // In a real app, you would call an API to create an order
    console.log('Proceeding to checkout with items:', cartItems);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to checkout page or show confirmation
    }, 1000);
  };

  const handleGoBack = () => {
    navigate(-1);
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
      <Button startIcon={<BackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
        Back
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      
      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any games to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/games')}
          >
            Browse Games
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Game</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => {
                    const subtotal = Number(item.Price) * item.quantity;
                    
                    return (
                      <TableRow key={item.gameId}>
                        <TableCell>
                          <Typography variant="subtitle1">{item.Title}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          ${Number(item.Price).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => decreaseQuantity(item.gameId)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.gameId, e.target.value)}
                              sx={{ width: '60px', mx: 1 }}
                              inputProps={{ 
                                min: 1, 
                                style: { textAlign: 'center' } 
                              }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => increaseQuantity(item.gameId)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${Number(subtotal).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveItem(item.gameId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Items:</Typography>
                  <Typography variant="body1">{cartItems.length}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Total Quantity:</Typography>
                  <Typography variant="body1">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${Number(calculateTotal()).toFixed(2)}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  color="primary"
                  size="large"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart; 