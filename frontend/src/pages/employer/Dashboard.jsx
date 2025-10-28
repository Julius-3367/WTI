import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
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
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BriefcaseIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  StarIcon,
  MapPinIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolid,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { useSelector } from 'react-redux';

// Custom tab panel component
const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`employer-tabpanel-${index}`}
    aria-labelledby={`employer-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </Box>
);

const EmployerDashboard = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Mock employer data
  const [employerData, setEmployerData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setEmployerData({
        stats: [
          {
            title: 'Active Job Postings',
            value: '12',
            change: '+3',
            trend: 'up',
            icon: BriefcaseIcon,
            color: theme.palette.primary.main,
          },
          {
            title: 'Total Applications',
            value: '156',
            change: '+24',
            trend: 'up',
            icon: DocumentTextIcon,
            color: theme.palette.info.main,
          },
          {
            title: 'Hired Candidates',
            value: '28',
            change: '+8',
            trend: 'up',
            icon: CheckCircleIcon,
            color: theme.palette.success.main,
          },
          {
            title: 'Recruitment Cost',
            value: '$8,450',
            change: '-12%',
            trend: 'down',
            icon: CurrencyDollarIcon,
            color: theme.palette.secondary.main,
          },
        ],
        jobPostings: [
          {
            id: 1,
            title: 'Senior Construction Worker',
            department: 'Construction',
            location: 'Dubai',
            salary: 'AED 3,500-4,500',
            status: 'Active',
            applications: 45,
            posted: '2024-01-15',
            expires: '2024-02-15',
            type: 'Full-time',
          },
          {
            id: 2,
            title: 'Electrical Technician',
            department: 'Maintenance',
            location: 'Abu Dhabi',
            salary: 'AED 4,200-5,200',
            status: 'Active',
            applications: 32,
            posted: '2024-01-20',
            expires: '2024-02-20',
            type: 'Full-time',
          },
          {
            id: 3,
            title: 'Project Manager',
            department: 'Management',
            location: 'Dubai',
            salary: 'AED 8,000-12,000',
            status: 'Closed',
            applications: 78,
            posted: '2024-01-10',
            expires: '2024-02-10',
            type: 'Full-time',
          },
          {
            id: 4,
            title: 'Safety Officer',
            department: 'Health & Safety',
            location: 'Sharjah',
            salary: 'AED 5,500-7,000',
            status: 'Draft',
            applications: 0,
            posted: '2024-01-25',
            expires: '2024-02-25',
            type: 'Full-time',
          },
        ],
        applications: [
          {
            id: 1,
            candidateName: 'Ahmed Hassan',
            position: 'Senior Construction Worker',
            appliedDate: '2024-01-20',
            status: 'Interview Scheduled',
            experience: '5 years',
            rating: 4.5,
            email: 'ahmed.hassan@email.com',
          },
          {
            id: 2,
            candidateName: 'Sarah Al-Mahmoud',
            position: 'Electrical Technician',
            appliedDate: '2024-01-22',
            status: 'Under Review',
            experience: '3 years',
            rating: 4.2,
            email: 'sarah.mahmoud@email.com',
          },
          {
            id: 3,
            candidateName: 'Mohammad Khalil',
            position: 'Project Manager',
            appliedDate: '2024-01-18',
            status: 'Hired',
            experience: '8 years',
            rating: 4.8,
            email: 'mohammad.khalil@email.com',
          },
          {
            id: 4,
            candidateName: 'Fatima Al-Zahra',
            position: 'Safety Officer',
            appliedDate: '2024-01-24',
            status: 'Rejected',
            experience: '2 years',
            rating: 3.9,
            email: 'fatima.zahra@email.com',
          },
        ],
        recentActivity: [
          {
            id: 1,
            type: 'application',
            message: 'New application received for Senior Construction Worker',
            candidate: 'Ahmed Hassan',
            time: '2 hours ago',
          },
          {
            id: 2,
            type: 'interview',
            message: 'Interview scheduled with Sarah Al-Mahmoud',
            time: '4 hours ago',
          },
          {
            id: 3,
            type: 'hire',
            message: 'Mohammad Khalil hired for Project Manager position',
            time: '1 day ago',
          },
          {
            id: 4,
            type: 'job_posted',
            message: 'New job posting created: Safety Officer',
            time: '2 days ago',
          },
        ],
        applicationTrends: [
          { month: 'Jul', applications: 98, hires: 12 },
          { month: 'Aug', applications: 125, hires: 18 },
          { month: 'Sep', applications: 89, hires: 14 },
          { month: 'Oct', applications: 156, hires: 22 },
          { month: 'Nov', applications: 134, hires: 19 },
          { month: 'Dec', applications: 167, hires: 25 },
        ],
        statusDistribution: [
          { name: 'Under Review', value: 45, color: theme.palette.info.main },
          { name: 'Interview', value: 23, color: theme.palette.warning.main },
          { name: 'Hired', value: 28, color: theme.palette.success.main },
          { name: 'Rejected', value: 60, color: theme.palette.error.main },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [theme]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return theme.palette.success;
      case 'Draft':
        return theme.palette.warning;
      case 'Closed':
        return theme.palette.error;
      case 'Interview Scheduled':
        return theme.palette.warning;
      case 'Under Review':
        return theme.palette.info;
      case 'Hired':
        return theme.palette.success;
      case 'Rejected':
        return theme.palette.error;
      default:
        return theme.palette.grey;
    }
  };

  const getActivityIcon = type => {
    switch (type) {
      case 'application':
        return <DocumentTextIcon style={{ width: 20, height: 20 }} />;
      case 'interview':
        return <CalendarIcon style={{ width: 20, height: 20 }} />;
      case 'hire':
        return <CheckCircleSolid style={{ width: 20, height: 20 }} />;
      case 'job_posted':
        return <BriefcaseIcon style={{ width: 20, height: 20 }} />;
      default:
        return <ClockIcon style={{ width: 20, height: 20 }} />;
    }
  };

  const handleJobView = job => {
    setSelectedJob(job);
    setJobDialogOpen(true);
  };

  const filteredJobs =
    employerData?.jobPostings.filter(
      job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredApplications =
    employerData?.applications.filter(app => {
      const matchesSearch =
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' || app.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={64} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Welcome Banner */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Grid container alignItems="center" spacing={3}>
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '2rem',
                bgcolor: 'rgba(255,255,255,0.2)',
              }}
            >
              {user?.firstName?.charAt(0) || 'E'}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Welcome, {user?.firstName || 'Employer'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Manage your job postings and find the best candidates
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }}
              >
                Post New Job
              </Button>
              <Button
                variant="outlined"
                startIcon={<UserGroupIcon style={{ width: 20, height: 20 }} />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Browse Candidates
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {employerData.stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    <stat.icon style={{ width: 24, height: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    size="small"
                    label={stat.change}
                    sx={{
                      backgroundColor:
                        stat.trend === 'up'
                          ? theme.palette.success.light
                          : theme.palette.error.light,
                      color:
                        stat.trend === 'up'
                          ? theme.palette.success.dark
                          : theme.palette.error.dark,
                      fontWeight: 600,
                    }}
                  />
                  <ArrowTrendingUpIcon
                    style={{
                      width: 16,
                      height: 16,
                      color:
                        stat.trend === 'up'
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      marginLeft: 8,
                      transform:
                        stat.trend === 'down' ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Job Postings" />
          <Tab label="Applications" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Charts Section */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                {/* Application Trends Chart */}
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Application & Hiring Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={employerData.applicationTrends}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme.palette.grey[200]}
                        />
                        <XAxis
                          dataKey="month"
                          stroke={theme.palette.text.secondary}
                        />
                        <YAxis stroke={theme.palette.text.secondary} />
                        <RechartsTooltip />
                        <Area
                          type="monotone"
                          dataKey="applications"
                          stackId="1"
                          stroke={theme.palette.primary.main}
                          fill={theme.palette.primary.main}
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="hires"
                          stackId="2"
                          stroke={theme.palette.success.main}
                          fill={theme.palette.success.main}
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Application Status Distribution
                    </Typography>
                    <Grid container spacing={2}>
                      {employerData.statusDistribution.map((status, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: status.color,
                                mr: 2,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {status.name}
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {status.value}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Recent Activity */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {employerData.recentActivity.map((activity, index) => (
                        <React.Fragment key={activity.id}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  backgroundColor:
                                    activity.type === 'hire'
                                      ? theme.palette.success.light
                                      : activity.type === 'application'
                                        ? theme.palette.info.light
                                        : activity.type === 'interview'
                                          ? theme.palette.warning.light
                                          : theme.palette.primary.light,
                                  color:
                                    activity.type === 'hire'
                                      ? theme.palette.success.main
                                      : activity.type === 'application'
                                        ? theme.palette.info.main
                                        : activity.type === 'interview'
                                          ? theme.palette.warning.main
                                          : theme.palette.primary.main,
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {getActivityIcon(activity.type)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {activity.message}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {activity.time}
                                  {activity.candidate &&
                                    ` • ${activity.candidate}`}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < employerData.recentActivity.length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Quick Stats
                    </Typography>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">
                          Avg. Time to Hire
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          14 days
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">Interview Rate</Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.success.main,
                          }}
                        >
                          68%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">
                          Hiring Success Rate
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                          }}
                        >
                          45%
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Job Postings Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Search job postings..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MagnifyingGlassIcon
                          style={{ width: 20, height: 20 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
                  >
                    Post New Job
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {filteredJobs.map(job => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {job.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={job.status}
                        sx={{
                          bgcolor: getStatusColor(job.status).light,
                          color: getStatusColor(job.status).dark,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {job.department}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Chip
                        size="small"
                        icon={<MapPinIcon style={{ width: 14, height: 14 }} />}
                        label={job.location}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.success.main,
                        }}
                      >
                        {job.salary}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {job.applications} applications
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Posted: {job.posted}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleJobView(job)}
                      >
                        View Details
                      </Button>
                      <Button size="small" variant="text">
                        Edit
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Applications Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MagnifyingGlassIcon
                          style={{ width: 20, height: 20 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    label="Filter by Status"
                  >
                    <MenuItem value="all">All Applications</MenuItem>
                    <MenuItem value="Under Review">Under Review</MenuItem>
                    <MenuItem value="Interview Scheduled">
                      Interview Scheduled
                    </MenuItem>
                    <MenuItem value="Hired">Hired</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 600 }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Applied Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(application => (
                    <TableRow key={application.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{ mr: 2, bgcolor: theme.palette.primary.light }}
                          >
                            {application.candidateName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {application.candidateName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {application.experience} experience
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {application.position}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {application.appliedDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={application.status}
                          sx={{
                            bgcolor: getStatusColor(application.status).light,
                            color: getStatusColor(application.status).dark,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon
                            style={{
                              width: 16,
                              height: 16,
                              color: theme.palette.warning.main,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ ml: 0.5, fontWeight: 600 }}
                          >
                            {application.rating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Profile">
                            <IconButton size="small">
                              <EyeIcon style={{ width: 18, height: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredApplications.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={event => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="body1" color="text.secondary">
            Advanced analytics and reporting interface for recruitment metrics.
          </Typography>
        </TabPanel>
      </Paper>

      {/* Job Details Dialog */}
      <Dialog
        open={jobDialogOpen}
        onClose={() => setJobDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedJob && (
          <>
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {selectedJob.title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.department}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.location}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Salary Range
                  </Typography>
                  <Typography variant="body1">{selectedJob.salary}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Applications
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.applications}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Posted Date
                  </Typography>
                  <Typography variant="body1">{selectedJob.posted}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Expires
                  </Typography>
                  <Typography variant="body1">{selectedJob.expires}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setJobDialogOpen(false)}>Close</Button>
              <Button variant="contained">Edit Job</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default EmployerDashboard;
