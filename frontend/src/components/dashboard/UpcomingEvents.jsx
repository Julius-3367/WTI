import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Skeleton,
  IconButton,
} from '@mui/material';
import {
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

/**
 * Upcoming Events Card
 * Shows upcoming events/sessions across all dashboards
 */
const UpcomingEvents = ({ events = [], loading = false, onEventClick, title = 'Upcoming Events' }) => {
  const getEventDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const getEventStatus = (dateStr) => {
    const date = new Date(dateStr);
    if (isPast(date)) return { label: 'Past', color: 'default' };
    if (isToday(date)) return { label: 'Today', color: 'error' };
    if (isTomorrow(date)) return { label: 'Tomorrow', color: 'warning' };
    return { label: 'Upcoming', color: 'info' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={title}
        avatar={<EventIcon />}
        action={
          events.length > 3 && (
            <IconButton size="small">
              <ArrowIcon />
            </IconButton>
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {events.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No upcoming events
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {events.slice(0, 5).map((event, index) => {
              const status = getEventStatus(event.date);
              return (
                <ListItem
                  key={event.id || index}
                  sx={{
                    px: 0,
                    cursor: onEventClick ? 'pointer' : 'default',
                    '&:hover': onEventClick
                      ? {
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                      }
                      : {},
                  }}
                  onClick={() => onEventClick && onEventClick(event)}
                >
                  <ListItemIcon>
                    <CalendarIcon color={status.color} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {event.title}
                        </Typography>
                        <Chip label={status.label} size="small" color={status.color} sx={{ height: 20 }} />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {getEventDateLabel(event.date)}
                        </Typography>
                        {event.time && (
                          <>
                            <Typography variant="caption" color="text.secondary">
                              •
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <TimeIcon sx={{ fontSize: 14 }} />
                              <Typography variant="caption" color="text.secondary">
                                {event.time}
                              </Typography>
                            </Box>
                          </>
                        )}
                        {event.location && (
                          <>
                            <Typography variant="caption" color="text.secondary">
                              •
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {event.location}
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
