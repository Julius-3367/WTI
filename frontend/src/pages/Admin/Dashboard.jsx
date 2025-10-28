import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Avatar, 
  LinearProgress,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material/styles';

// Styled Components
const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const StatIcon = styled(Avatar)(({ theme, color }) => ({
  width: 56,
  height: 56,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette[color]?.light || theme.palette.grey[200],
  color: theme.palette[color]?.dark || theme.palette.grey[700],
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  margin: theme.spacing(1, 0),
  color: theme.palette.text.primary,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const StatChange = styled(Typography)(({ theme, positive }) => ({
  display: 'flex',
  alignItems: 'center',
  color: positive ? theme.palette.success.main : theme.palette.error.main,
  fontWeight: 500,
  '& svg': {
    marginRight: theme.spacing(0.5),
  },
}));

// TabPanel component for tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Function to generate tab props
function a11yProps(index) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Stats data
  const stats = [
    {
      title: 'Total Users',
      value: '2,345',
      change: 12.5,
      icon: <PeopleIcon fontSize="large" />,
      color: 'primary',
      to: '/admin/users'
    },
    {
      title: 'Active Jobs',
      value: '156',
      change: 8.2,
      icon: <WorkIcon fontSize="large" />,
      color: 'secondary',
      to: '/admin/jobs'
    },
    {
      title: 'Pending Verifications',
      value: '42',
      change: -3.1,
      icon: <VerifiedUserIcon fontSize="large" />,
      color: 'warning',
      to: '/admin/verification'
    },
    {
      title: 'Training Programs',
      value: '18',
      change: 5.7,
      icon: <SchoolIcon fontSize="large" />,
      color: 'info',
      to: '/admin/training'
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'completed profile verification',
      time: '2 min ago',
      type: 'verification',
      status: 'completed'
    },
    {
      id: 2,
      user: 'Acme Corp',
      action: 'posted a new job',
      time: '1 hour ago',
      type: 'job',
      status: 'pending'
    },
    {
      id: 3,
      user: 'Sarah Smith',
      action: 'applied for Senior Developer',
      time: '3 hours ago',
      type: 'application',
      status: 'new'
    },
    {
      id: 4,
      user: 'Tech Solutions',
      action: 'needs verification',
      time: '5 hours ago',
      type: 'verification',
      status: 'pending'
    },
  ];

  // Pending approvals
  const pendingApprovals = [
    { id: 1, type: 'Employer', name: 'Tech Innovators Inc.', date: '2023-10-25', status: 'pending' },
    { id: 2, type: 'Job Post', name: 'Senior UX Designer', date: '2023-10-24', status: 'pending' },
    { id: 3, type: 'User', name: 'alex.johnson@example.com', date: '2023-10-23', status: 'pending' },
  ];

  // Recent verifications
  const recentVerifications = [
    { id: 1, user: 'Michael Brown', type: 'ID', status: 'approved', date: '2023-10-26' },
    { id: 2, user: 'Emily Davis', type: 'Education', status: 'pending', date: '2023-10-25' },
    { id: 3, user: 'Robert Wilson', type: 'Employment', status: 'rejected', date: '2023-10-24' },
  ];

  // Training programs
  const trainingPrograms = [
    { id: 1, name: 'Advanced React', enrolled: 45, completion: 68, status: 'active' },
    { id: 2, name: 'Project Management', enrolled: 32, completion: 42, status: 'active' },
    { id: 3, name: 'Data Science Basics', enrolled: 28, completion: 15, status: 'upcoming' },
  ];
      color: 'primary',
    },
    {
      title: 'Active Jobs',
      value: '156',
      change: 8.2,
      icon: <WorkIcon fontSize="large" />,
      color: 'secondary',
    },
    {
      title: 'Applications',
      value: '1,234',
      change: -3.1,
      icon: <AssignmentIcon fontSize="large" />,
      color: 'info',
    },
    {
      title: 'Employers',
      value: '89',
      change: 5.7,
      icon: <BusinessIcon fontSize="large" />,
      color: 'warning',
    },
  ];

  // Recent activities data
  const activities = [
    { id: 1, user: 'John Doe', action: 'applied for Senior Developer', time: '2 min ago' },
    { id: 2, user: 'Acme Inc', action: 'posted a new job', time: '1 hour ago' },
    { id: 3, user: 'Sarah Smith', action: 'completed profile verification', time: '3 hours ago' },
    { id: 4, user: 'TechCorp', action: 'hired 5 candidates', time: '5 hours ago' },
    { id: 5, user: 'Mike Johnson', action: 'updated CV', time: '1 day ago' },
  ];

  // Job applications data
  const applications = [
    { id: 1, job: 'Senior Frontend Developer', company: 'TechCorp', status: 'Pending', date: '2023-10-25', progress: 60 },
    { id: 2, job: 'UX/UI Designer', company: 'DesignHub', status: 'Review', date: '2023-10-24', progress: 30 },
    { id: 3, job: 'Backend Engineer', company: 'DataSystems', status: 'Interview', date: '2023-10-23', progress: 80 },
    { id: 4, job: 'Product Manager', company: 'InnovateCo', status: 'Hired', date: '2023-10-20', progress: 100 },
    { id: 5, job: 'DevOps Engineer', company: 'CloudScale', status: 'Rejected', date: '2023-10-18', progress: 0 },
  ];

  // Data for charts (simplified)
  const jobData = [
    { name: 'Jan', jobs: 65 },
    { name: 'Feb', jobs: 59 },
    { name: 'Mar', jobs: 80 },
    { name: 'Apr', jobs: 81 },
    { name: 'May', jobs: 56 },
    { name: 'Jun', jobs: 55 },
    { name: 'Jul', jobs: 40 },
  ];

  const categoryData = [
    { name: 'IT', value: 35 },
    { name: 'Healthcare', value: 25 },
    { name: 'Engineering', value: 20 },
    { name: 'Education', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'hired':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'pending':
        return <PendingIcon color="warning" fontSize="small" />;
      case 'interview':
        return <ScheduleIcon color="info" fontSize="small" />;
      case 'rejected':
        return <NotificationsActiveIcon color="error" fontSize="small" />;
      default:
        return <PendingIcon color="action" fontSize="small" />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ mt: -1, mb: 0 }}>
            Welcome back! Here's what's happening with your platform.
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size={isMobile ? 'small' : 'medium'}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <CardActionArea component="a" href={stat.to}>
              <StatCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <StatLabel variant="subtitle2">{stat.title}</StatLabel>
                    <StatValue variant="h3">{stat.value}</StatValue>
                    <StatChange positive={stat.change >= 0}>
                      <TrendingUpIcon fontSize="small" />
                      {Math.abs(stat.change)}% {stat.change >= 0 ? 'increase' : 'decrease'} from last month
                    </StatChange>
                  </Box>
                  <StatIcon color={stat.color}>
                    {stat.icon}
                  </StatIcon>
                </Box>
              </StatCard>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for different sections */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Candidates" {...a11yProps(1)} />
            <Tab label="Employers" {...a11yProps(2)} />
            <Tab label="Jobs" {...a11yProps(3)} />
            <Tab label="Training" {...a11yProps(4)} />
            <Tab label="Reports" {...a11yProps(5)} />
            <Tab label="Verification" {...a11yProps(6)} />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Recent Activities */}
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h2">Recent Activities</Typography>
                    <Button size="small" color="primary">View All</Button>
                  </Box>
                  <Box>
                    {recentActivities.map((activity) => (
                      <Box key={activity.id} sx={{ mb: 2, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box display="flex" alignItems="flex-start">
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              mr: 2, 
                              bgcolor: 
                                activity.status === 'completed' ? 'success.light' : 
                                activity.status === 'pending' ? 'warning.light' : 'primary.light',
                              color: 'common.white'
                            }}
                          >
                            {activity.user.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                              <Typography variant="subtitle2" component="div">
                                <Box component="span" fontWeight="600">{activity.user}</Box> {activity.action}
                              </Typography>
                              <Chip 
                                label={activity.status} 
                                size="small" 
                                color={
                                  activity.status === 'completed' ? 'success' :
                                  activity.status === 'pending' ? 'warning' : 'primary'
                                }
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Pending Approvals */}
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h2">Pending Approvals</Typography>
                    <Button size="small" color="primary">View All</Button>
                  </Box>
                  <Box>
                    {pendingApprovals.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle2">{item.name}</Typography>
                            <Box display="flex" alignItems="center" mt={0.5}>
                              <Chip 
                                label={item.type} 
                                size="small" 
                                variant="outlined"
                                sx={{ mr: 1, fontSize: '0.7rem' }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(item.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                          >
                            Review
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Verifications */}
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h2">Recent Verifications</Typography>
                    <Button size="small" color="primary">View All</Button>
                  </Box>
                  <Box>
                    {recentVerifications.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle2">{item.user}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.type} Verification • {new Date(item.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip 
                            label={item.status} 
                            size="small"
                            color={
                              item.status === 'approved' ? 'success' :
                              item.status === 'pending' ? 'warning' : 'error'
                            }
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Training Programs */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h2">Training Programs</Typography>
                    <Button size="small" color="primary" startIcon={<AddIcon />}>Add Program</Button>
                  </Box>
                  <Box>
                    {trainingPrograms.map((program, index) => (
                      <Box key={program.id} sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle1">{program.name}</Typography>
                          <Chip 
                            label={program.status} 
                            size="small" 
                            color={program.status === 'active' ? 'success' : 'default'}
                          />
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {program.enrolled} enrolled • {program.completion}% completed
                            </Typography>
                            <Box sx={{ width: '100%', mt: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={program.completion} 
                                color="primary"
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </Box>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>Platform Statistics</Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Active Users', value: '1,842', change: '+12%', icon: <PeopleIcon color="primary" /> },
                      { label: 'Total Jobs Posted', value: '324', change: '+8%', icon: <WorkIcon color="secondary" /> },
                      { label: 'Applications This Month', value: '1,245', change: '+24%', icon: <AssignmentIcon color="info" /> },
                      { label: 'Training Enrollments', value: '568', change: '+15%', icon: <SchoolIcon color="warning" /> },
                    ].map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                              <Box sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                bgcolor: `${stat.icon.props.color}.light`, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mr: 1.5
                              }}>
                                {React.cloneElement(stat.icon, { fontSize: 'small' })}
                              </Box>
                              <Box>
                                <Typography variant="h6">{stat.value}</Typography>
                                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                              </Box>
                            </Box>
                            <Typography variant="caption" color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}>
                              {stat.change} from last month
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Candidates Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Candidates Management</Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography>Candidate management content goes here...</Typography>
          </Paper>
        </TabPanel>

        {/* Employers Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>Employers Management</Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography>Employer management content goes here...</Typography>
          </Paper>
        </TabPanel>

        {/* Jobs Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Job Listings</Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography>Job management content goes here...</Typography>
          </Paper>
        </TabPanel>

        {/* Training Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>Training Programs</Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography>Training management content goes here...</Typography>
          </Paper>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>Analytics & Reports</Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography>Reports and analytics content goes here...</Typography>
          </Paper>
        </TabPanel>

        {/* Verification Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>Verification Center</Typography>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography>Verification management content goes here...</Typography>
          </Paper>
        </TabPanel>
      </Grid>
    </Box>
  );
};

export default Dashboard;