import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
  Container,
  Stack,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  Cog6ToothIcon,
  BellIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/**
 * BEFORE: Traditional Tailwind CSS Dashboard Component
 * This shows how dashboard components were structured before theme migration
 */
const BeforeThemeDashboard = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Welcome Banner - BEFORE */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your dashboard overview</p>
      </div>

      {/* Stats Cards - BEFORE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-lg font-medium text-gray-900">2,847</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">+12.5%</span>
              <span className="text-gray-500"> vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section - BEFORE */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
        <div className="h-80">
          {/* Chart would go here */}
        </div>
      </div>
    </div>
  );
};

/**
 * AFTER: Theme-aware Material-UI Dashboard Component
 * This shows the same dashboard converted to use the theme system
 */
const AfterThemeDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  // Sample data
  const statsData = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: UserGroupIcon,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Courses',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: AcademicCapIcon,
      color: theme.palette.success.main,
    },
    {
      title: 'Companies',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: BuildingOfficeIcon,
      color: theme.palette.warning.main,
    },
    {
      title: 'Revenue',
      value: '$235K',
      change: '+23.1%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: theme.palette.secondary.main,
    },
  ];

  const chartData = [
    { month: 'Jan', users: 1200, revenue: 45000 },
    { month: 'Feb', users: 1400, revenue: 52000 },
    { month: 'Mar', users: 1800, revenue: 61000 },
    { month: 'Apr', users: 2100, revenue: 68000 },
    { month: 'May', users: 2400, revenue: 75000 },
    { month: 'Jun', users: 2847, revenue: 85000 },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Ahmed Hassan',
      action: 'completed Construction Safety Training',
      time: '2 hours ago',
      type: 'success',
    },
    {
      id: 2,
      user: 'Sarah Al-Mahmoud',
      action: 'applied for Electrical Technician position',
      time: '4 hours ago',
      type: 'info',
    },
    {
      id: 3,
      user: 'Emirates Construction',
      action: 'posted new job opening',
      time: '6 hours ago',
      type: 'warning',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Welcome Banner - AFTER with Theme */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: theme.shape.borderRadius * 1.5,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 400,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
            }}
          >
            Welcome to your comprehensive labor mobility platform
          </Typography>

          {/* Quick Actions */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                },
                backdropFilter: 'blur(10px)',
              }}
            >
              Add New User
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ChartBarIcon style={{ width: 20, height: 20 }} />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              View Reports
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Stats Cards - AFTER with Theme */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius * 1.5,
                transition: theme.transitions.create(['transform', 'box-shadow'], {
                  duration: theme.transitions.duration.short,
                }),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: stat.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}15`,
                      color: stat.color,
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    <stat.icon style={{ width: 24, height: 24 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '0.75rem', fontWeight: 500, mb: 0.5 }}
                    >
                      {stat.title.toUpperCase()}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        lineHeight: 1.2,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    size="small"
                    icon={<ArrowTrendingUpIcon style={{ width: 14, height: 14 }} />}
                    label={stat.change}
                    sx={{
                      bgcolor: theme.palette.success.light,
                      color: theme.palette.success.dark,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      '& .MuiChip-icon': {
                        color: theme.palette.success.main,
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Chart Section - AFTER with Theme */}
        <Grid item xs={12} lg={8}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius * 1.5,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  User Growth & Revenue
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <EyeIcon style={{ width: 18, height: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <IconButton size="small">
                      <Cog6ToothIcon style={{ width: 18, height: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                      dataKey="month"
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <YAxis
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[4],
                      }}
                    />
                    <Bar
                      dataKey="users"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities - AFTER with Theme */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius * 1.5,
              height: 'fit-content',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activities
                </Typography>
                <Badge badgeContent={3} color="primary">
                  <BellIcon style={{ width: 20, height: 20, color: theme.palette.text.secondary }} />
                </Badge>
              </Box>

              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              activity.type === 'success' ? theme.palette.success.light :
                              activity.type === 'info' ? theme.palette.info.light :
                              theme.palette.warning.light,
                            color:
                              activity.type === 'success' ? theme.palette.success.main :
                              activity.type === 'info' ? theme.palette.info.main :
                              theme.palette.warning.main,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {activity.type === 'success' ? (
                            <CheckCircleIcon style={{ width: 20, height: 20 }} />
                          ) : activity.type === 'info' ? (
                            <UserGroupIcon style={{ width: 20, height: 20 }} />
                          ) : (
                            <DocumentTextIcon style={{ width: 20, height: 20 }} />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            <Box component="span" sx={{ color: theme.palette.primary.main }}>
                              {activity.user}
                            </Box>{' '}
                            {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button
                  variant="text"
                  fullWidth
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }}
                >
                  View All Activities
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* System Status Card */}
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius * 1.5,
              mt: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                System Health
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Server Performance</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                      98%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={98}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.success.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Database Status</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      Optimal
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Alert
                  severity="success"
                  sx={{
                    bgcolor: theme.palette.success.light,
                    color: theme.palette.success.dark,
                    borderRadius: theme.shape.borderRadius,
                    '& .MuiAlert-icon': {
                      color: theme.palette.success.main,
                    },
                  }}
                >
                  All systems operational
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

/**
 * Migration Comparison Component
 * Shows both versions side by side for educational purposes
 */
const DashboardMigrationExample = () => {
  const [showAfter, setShowAfter] = useState(true);
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Toggle Controls */}
      <Paper
        elevation={2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          p: 2,
          mb: 3,
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Dashboard Migration Example
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant={!showAfter ? 'contained' : 'outlined'}
                onClick={() => setShowAfter(false)}
                size="small"
              >
                Before (Tailwind)
              </Button>
              <Button
                variant={showAfter ? 'contained' : 'outlined'}
                onClick={() => setShowAfter(true)}
                size="small"
              >
                After (Theme-aware)
              </Button>
            </Stack>
          </Box>
        </Container>
      </Paper>

      {/* Dashboard Content */}
      {showAfter ? <AfterThemeDashboard /> : <BeforeThemeDashboard />}

      {/* Migration Notes */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="info"
          sx={{
            borderRadius: theme.shape.borderRadius * 1.5,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Key Migration Benefits:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                🎨 Consistent Theming
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All colors, typography, and spacing follow the centralized theme configuration
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                📱 Better Responsive Design
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Material-UI's responsive system with theme breakpoints
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                ♿ Enhanced Accessibility
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built-in accessibility features and ARIA support
              </Typography>
            </Grid>
          </Grid>
        </Alert>
      </Container>
    </Box>
  );
};

export default DashboardMigrationExample;
