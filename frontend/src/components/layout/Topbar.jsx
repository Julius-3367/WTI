import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { logoutUser } from '../../features/auth/authThunks';

/**
 * Top navigation bar component
 * Displays user info, search, notifications, and user menu
 */
const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  
  const { user } = useSelector((state) => state.auth);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    handleMenuClose();
  };
  
  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };
  
  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };
  
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchValue);
    }
  };
  
  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'primary-search-account-menu';
  
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
      {/* Search */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search candidates, courses..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
          }}
        />
      </Box>
      
      {/* Notifications */}
      <Tooltip title="Notifications">
        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
        >
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      {/* Profile Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={user?.avatar}
            alt={user?.firstName}
          >
            {user?.firstName?.charAt(0)}
          </Avatar>
        </IconButton>
      </Box>
      
      {/* Profile Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfile}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;
