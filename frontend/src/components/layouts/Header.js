import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography, IconButton, Badge, Avatar, Menu, MenuItem, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Search as SearchIcon, ShoppingCart, PeopleAlt, Assignment, PowerSettingsNew, Dashboard } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Search from './Search';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  const isLoggedIn = Boolean(user);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Add any other icons or links you want in the drawer
  const drawerItems = [
    { label: 'Home', icon: <PeopleAlt />, link: '/' },
    { label: 'Profile', icon: <Assignment />, link: '/me' },
  ];
  
  if (user && user.role !== 'admin') {
    drawerItems.push(
      { label: 'Orders', icon: <Assignment />, link: '/orders/me' }
    );
  }

  if (user && user.role === 'admin') {
    drawerItems.push(
      { label: 'Dashboard', icon: <Dashboard />, link: '/dashboard' }
    );
  }
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Fragment>
      <AppBar position="static" sx={{ background: "#DEB887" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <SearchIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cleopatra
          </Typography>
          <Search />

          <div>
            {isLoggedIn ? (
              <Fragment>
                {user.role !== 'admin' && ( // Hide cart for admin users
                  <IconButton component={RouterLink} to="/cart" color="inherit">
                    <Badge badgeContent={cartItems ? cartItems.length : 0} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                )}

                <IconButton onClick={handleMenuClick} color="inherit">
                  <Avatar alt={user.name} src={user.avatar && user.avatar.length > 0 && user.avatar[0].url} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {user.role !== 'admin' && (
                    <MenuItem component={RouterLink} to="/orders/me">Orders</MenuItem>
                  )}
                  <MenuItem component={RouterLink} to="/me">Profile</MenuItem>
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>
              </Fragment>
            ) : (
              <Button component={RouterLink} to="/login" color="inherit">
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <List>
          {drawerItems.map((item) => (
            <ListItem button key={item.label} component={RouterLink} to={item.link} onClick={handleDrawerClose}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Fragment>
  );
};

export default Header;