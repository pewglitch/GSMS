import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Background from './components/Background';

// Components
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Publishers from './pages/Publishers';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Query from './pages/Query';
import Login from './pages/Login';
import Register from './pages/Register';
import Forum from './pages/Forum';
import TopGames from './pages/TopGames';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#404040',
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Bungee", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: 2,
      color: '#ffffff',
      '@media (max-width: 600px)': {
        fontSize: '2rem',
      }
    },
    h2: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '2rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h3: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h4: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h5: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h6: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '1rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      fontFamily: '"Bungee", "Roboto", "Helvetica", "Arial", sans-serif',
      color: '#ffffff',
    },
    body2: {
      fontFamily: '"Bungee", "Roboto", "Helvetica", "Arial", sans-serif',
      color: '#b3b3b3',
    },
    button: {
      fontFamily: '"Bungee", "Roboto", "Helvetica", "Arial", sans-serif',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Bungee", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#404040',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
        },
      },
    },
  },
});

// Add Google Fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Press+Start+2P&display=swap');
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <style>{fontStyles}</style>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Header />
            <Background />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:id" element={<GameDetails />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/publishers" element={<Publishers />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/query" element={<Query />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forum" element={<Forum />} />
               <Route path="/top-games" element={<TopGames />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;