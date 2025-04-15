import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  SportsEsports as GamesIcon,
  People as CustomersIcon,
  Business as PublishersIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Forum as ForumIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userType, logout } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
    { text: 'Games', icon: <GamesIcon />, path: '/games' },
    { text: 'Top Games', icon: <GamesIcon />, path: '/top-games' },
    { text: 'Query', icon: <HomeIcon />, path: '/query' },
    { text: 'Forum', icon: <ForumIcon />, path: '/forum' },
    { text: 'Cart', icon: <CartIcon />, path: '/cart' }
  ];

  const adminMenuItems = [
    { text: 'Customers', icon: <CustomersIcon />, path: '/customers' },
    { text: 'Publishers', icon: <PublishersIcon />, path: '/publishers' },
    { text: 'Query', icon: <HomeIcon />, path: '/query' }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Game Store
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component="a" 
            href={item.path}
            sx={{ 
              textDecoration: 'none', 
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {userType === 'admin' && adminMenuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component="a" 
            href={item.path}
            sx={{ 
              textDecoration: 'none', 
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        {!user && (
          <>
            <ListItem 
              component="a" 
              href="/login"
              sx={{ 
                textDecoration: 'none', 
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem 
              component="a" 
              href="/register"
              sx={{ 
                textDecoration: 'none', 
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h1"
              component="div"
              sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' },
                fontSize: '2.5rem',
                fontWeight: 700,
                letterSpacing: 2,
                fontFamily: '"Press Start 2P", cursive',
                color: '#ffffff',
                '@media (max-width: 600px)': {
                  fontSize: '2rem',
                }
              }}
            >
              Game Store
            </Typography>
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              alignItems: 'center'
            }}>
              {menuItems.map((item) => {
  const isTopGames = item.path === '/top-games';
  const isActive = location.pathname === item.path;
  return (
    <Button
      key={item.text}
      component="a"
      href={item.path}
      startIcon={item.icon}
      sx={{
        my: 2,
        color: isTopGames ? (isActive ? '#FFD700' : '#FFB300') : (isActive ? '#90caf9' : 'white'),
        backgroundColor: isTopGames && isActive ? '#333333' : 'transparent',
        border: isTopGames ? '2px solid #FFD700' : 'none',
        borderRadius: isTopGames ? 2 : 0,
        display: 'block',
        fontSize: '1.2rem',
        fontWeight: 700,
        fontFamily: '"Bungee", cursive',
        textTransform: 'uppercase',
        px: 2,
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: isTopGames ? '#FFD700' : theme.palette.action.hover,
          color: isTopGames ? '#222' : '#fff',
          border: isTopGames ? '2px solid #FFD700' : 'none',
        },
        boxShadow: isTopGames && isActive ? '0 2px 8px #FFD70055' : 'none',
      }}
    >
      {item.text}
    </Button>
  );
})}
              {userType === 'admin' && adminMenuItems.map((item) => (
                <Button
                  key={item.text}
                  component="a"
                  href={item.path}
                  startIcon={item.icon}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    fontFamily: '"Roboto Condensed", sans-serif',
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
              {!user && (
                <>
                  <Button
                    component="a"
                    href="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      my: 2,
                      color: 'white',
                      display: 'block',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      fontFamily: '"Roboto Condensed", sans-serif',
                      textTransform: 'uppercase',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component="a"
                    href="/register"
                    startIcon={<PersonIcon />}
                    sx={{
                      my: 2,
                      color: 'white',
                      display: 'block',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      fontFamily: '"Roboto Condensed", sans-serif',
                      textTransform: 'uppercase',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
              {user && (
                <>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {user.name?.[0] || user.name?.[0]}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>
                      <Typography variant="body1">
                        {user.name}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Header;