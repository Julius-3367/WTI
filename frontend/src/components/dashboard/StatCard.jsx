import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';

/**
 * Reusable Stat Card Component
 * Used across all dashboards for consistent metric display
 */
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'primary',
  loading = false,
  onClick,
  subtitle,
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    if (!trend) return <RemoveIcon fontSize="small" />;
    if (trend > 0) return <TrendingUpIcon fontSize="small" />;
    return <TrendingDownIcon fontSize="small" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'default';
    return trend > 0 ? 'success' : 'error';
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="circular" width={56} height={56} />
          <Skeleton variant="text" sx={{ mt: 2 }} />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s',
        '&:hover': onClick
          ? {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
              width: 56,
              height: 56,
            }}
          >
            {Icon && <Icon fontSize="medium" />}
          </Avatar>
          <Box sx={{ ml: 'auto' }}>
            {trend !== undefined && (
              <Chip
                size="small"
                icon={getTrendIcon()}
                label={`${Math.abs(trend)}%`}
                color={getTrendColor()}
                sx={{ height: 24 }}
              />
            )}
          </Box>
        </Box>

        <Typography variant="h4" component="div" fontWeight={600}>
          {value?.toLocaleString() || 0}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {subtitle}
          </Typography>
        )}

        {trendLabel && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {trendLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
