import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  DoneAll as DoneAllIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import adminService from '../../api/admin';

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  // Fetch notifications when menu opens
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await adminService.getNotifications({ limit: 10 });
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (!open) {
      fetchNotifications();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await adminService.markNotificationAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await adminService.markAllNotificationsAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await adminService.deleteNotification(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: 'small' };
    switch (type?.toUpperCase()) {
      case 'SUCCESS':
        return <CheckCircleIcon {...iconProps} color="success" />;
      case 'ERROR':
        return <ErrorIcon {...iconProps} color="error" />;
      case 'WARNING':
        return <WarningIcon {...iconProps} color="warning" />;
      case 'INFO':
      default:
        return <InfoIcon {...iconProps} color="info" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'SUCCESS':
        return 'success.light';
      case 'ERROR':
        return 'error.light';
      case 'WARNING':
        return 'warning.light';
      case 'INFO':
      default:
        return 'info.light';
    }
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-label="show notifications"
          aria-controls={open ? 'notification-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 400,
            maxWidth: '90vw',
            maxHeight: 600,
            mt: 1.5,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip label={`${unreadCount} new`} size="small" color="primary" />
          )}
        </Box>

        {unreadCount > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                startIcon={loading ? <CircularProgress size={16} /> : <DoneAllIcon />}
                onClick={handleMarkAllAsRead}
                disabled={loading}
              >
                Mark all as read
              </Button>
            </Box>
          </>
        )}

        <Divider />

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">No notifications yet</Typography>
          </Box>
        ) : (
          <List sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!notification.isRead && (
                        <Tooltip title="Mark as read">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getNotificationColor(notification.type),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: notification.isRead ? 400 : 600,
                          pr: 8,
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block', pr: 8, mt: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.disabled"
                          sx={{ display: 'block', mt: 0.5 }}
                        >
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}

        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" fullWidth onClick={handleClose}>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
