import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';

/**
 * Unified Dashboard Layout
 * Consistent layout wrapper for all dashboards with auto-refresh indicator
 * 
 * @param {Object} props
 * @param {string} props.title - Dashboard title
 * @param {string} props.subtitle - Dashboard subtitle
 * @param {React.ReactNode} props.children - Dashboard content
 * @param {boolean} props.loading - Loading state
 * @param {Error} props.error - Error object if any
 * @param {Date} props.lastUpdated - Last update timestamp
 * @param {Function} props.onRefresh - Refresh handler
 * @param {React.ReactNode} props.actions - Additional action buttons
 * @param {React.ReactNode} props.alerts - Alert/notification components
 */
const DashboardLayout = ({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  lastUpdated = null,
  onRefresh,
  actions,
  alerts,
}) => {
  // Memoize the last updated text to prevent constant re-renders
  const lastUpdatedText = useMemo(() => {
    if (!lastUpdated) return null;
    return formatDistance(lastUpdated, new Date(), { addSuffix: true });
  }, [lastUpdated]);

  const lastUpdatedTooltip = useMemo(() => {
    if (!lastUpdated) return '';
    return `Last updated: ${lastUpdated.toLocaleString()}`;
  }, [lastUpdated]);

  return (
    <Box>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {lastUpdated && (
            <Tooltip title={lastUpdatedTooltip}>
              <Chip
                icon={<ScheduleIcon />}
                label={lastUpdatedText}
                size="small"
                variant="outlined"
              />
            </Tooltip>
          )}

          {onRefresh && (
            <Tooltip title="Refresh Dashboard">
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                size="small"
                sx={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}

          {actions}
        </Box>
      </Box>

      {/* Alerts */}
      {alerts && <Box sx={{ mb: 3 }}>{alerts}</Box>}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.response?.data?.message || error.message || 'Failed to load dashboard data'}
        </Alert>
      )}

      {/* Dashboard Content */}
      <Box sx={{ position: 'relative' }}>
        {loading && !lastUpdated && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Box sx={{ opacity: loading && !lastUpdated ? 0.3 : 1, transition: 'opacity 0.3s' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
