import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format, formatDistance } from 'date-fns';

/**
 * Activity Timeline Component
 * Shows recent activities/events across all dashboards
 */
const ActivityTimeline = ({ activities = [], loading = false, title = 'Recent Activity' }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      enrollment: <SchoolIcon />,
      assessment: <AssignmentIcon />,
      completion: <CheckCircleIcon />,
      event: <EventIcon />,
      user: <PersonIcon />,
      default: <ScheduleIcon />,
    };
    return iconMap[type] || iconMap.default;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      enrollment: 'primary',
      assessment: 'warning',
      completion: 'success',
      event: 'info',
      user: 'secondary',
      default: 'default',
    };
    return colorMap[type] || colorMap.default;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ display: 'flex', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent sx={{ pt: 0 }}>
        {activities.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No recent activity
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id || index}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: `${getActivityColor(activity.type)}.light`,
                        color: `${getActivityColor(activity.type)}.dark`,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp
                              ? formatDistance(new Date(activity.timestamp), new Date(), {
                                addSuffix: true,
                              })
                              : 'Just now'}
                          </Typography>
                          {activity.status && (
                            <Chip label={activity.status} size="small" sx={{ height: 20 }} />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < activities.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
