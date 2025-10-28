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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PlusIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolid,
  ClockIcon as ClockSolid,
  ExclamationTriangleIcon,
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
} from 'recharts';
import { useSelector } from 'react-redux';

// Custom tab panel component
const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`agent-tabpanel-${index}`}
    aria-labelledby={`agent-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </Box>
);

const AgentDashboard = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock agent data
  const [agentData, setAgentData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setAgentData({
        stats: [
          {
            title: 'My Candidates',
            value: '45',
            change: '+8',
            trend: 'up',
            icon: UserGroupIcon,
            color: theme.palette.primary.main,
          },
          {
            title: 'Active Submissions',
            value: '12',
            change: '+3',
            trend: 'up',
            icon: DocumentTextIcon,
            color: theme.palette.info.main,
          },
          {
            title: 'Successful Placements',
            value: '28',
            change: '+5',
            trend: 'up',
            icon: CheckCircleIcon,
            color: theme.palette.success.main,
          },
          {
            title: 'Commission Earned',
            value: '$12,450',
            change: '+15%',
            trend: 'up',
            icon: CurrencyDollarIcon,
            color: theme.palette.secondary.main,
          },
        ],
        myCandidates: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+971-50-123-4567',
            status: 'Submitted',
            submissionDate: '2024-01-25',
            jobTitle: 'Senior Caregiver',
            company: 'CarePlus Healthcare',
            expectedCommission: '$800',
            location: 'Dubai',
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+971-50-234-5678',
            status: 'Placed',
            submissionDate: '2024-01-20',
            jobTitle: 'Construction Supervisor',
            company: 'BuildRight Construction',
            expectedCommission: '$1,200',
            location: 'Abu Dhabi',
          },
          {
            id: 3,
            name: 'Michael Brown',
            email: 'michael.brown@email.com',
            phone: '+971-50-345-6789',
            status: 'Interview Scheduled',
            submissionDate: '2024-01-23',
            jobTitle: 'Hotel Manager',
            company: 'Premier Hotels',
            expectedCommission: '$950',
            location: 'Dubai',
          },
          {
            id: 4,
            name: 'Emma Wilson',
            email: 'emma.wilson@email.com',
            phone: '+971-50-456-7890',
            status: 'Document Review',
            submissionDate: '2024-01-24',
            jobTitle: 'Nurse',
            company: 'Health First Clinic',
            expectedCommission: '$700',
            location: 'Sharjah',
          },
          {
            id: 5,
            name: 'Ahmed Hassan',
            email: 'ahmed.hassan@email.com',
            phone: '+971-50-567-8901',
            status: 'Available',
            submissionDate: '2024-01-22',
            jobTitle: 'Electrician',
            company: 'Power Solutions LLC',
            expectedCommission: '$600',
            location: 'Dubai',
          },
        ],
        recentActivities: [
          {
            id: 1,
            type: 'submission',
            message: 'Submitted John Doe for Senior Caregiver position',
            time: '1 hour ago',
            company: 'CarePlus Healthcare',
          },
          {
            id: 2,
            type: 'placement',
            message: 'Sarah Johnson successfully placed at BuildRight Construction',
            time: '3 hours ago',
            earnings: '$1,200',
          },
          {
            id: 3,
            type: 'interview',
            message: 'Michael Brown scheduled for interview tomorrow',
            time: '1 day ago',
            company: 'Premier Hotels',
          },
          {
            id: 4,
            type: 'document',
            message: 'Uploaded updated certificates for 5 candidates',
            time: '2 days ago',
            count: 5,
          },
        ],
        placementTrends: [
          { month: 'Jul', placements: 8, commissions: 9500 },
          { month: 'Aug', placements: 12, commissions: 14200 },
          { month: 'Sep', placements: 10, commissions: 11800 },
          { month: 'Oct', placements: 15, commissions: 18500 },
          { month: 'Nov', placements: 18, commissions: 22400 },
          { month: 'Dec', placements: 20, commissions: 25600 },
        ],
        statusDistribution: [
          { name: 'Available', value: 18, color: theme.palette.success.main },
          { name: 'Submitted', value: 8, color: theme.palette.info.main },
          { name: 'Interview', value: 6, color: theme.palette.warning.main },
          { name: 'Placed', value: 13, color: theme.palette.primary.main },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [theme]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return theme.palette.success;
      case 'Submitted':
        return theme.palette.info;
      case 'Interview Scheduled':
        return theme.palette.warning;
      case 'Placed':
        return theme.palette.primary;
      case 'Document Review':
        return theme.palette.custom?.pending || theme.palette.warning;
      default:
        return theme.palette.grey;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'submission':
        return <PaperAirplaneIcon style={{ width: 20, height: 20 }} />;
      case 'placement':
        return <CheckCircleSolid style={{ width: 20, height: 20 }} />;
      case 'interview':
        return <CalendarIcon style={{ width: 20, height: 20 }} />;
      case 'document':
        return <DocumentTextIcon style={{ width: 20, height: 20 }} />;
      default:
        return <ClockSolid style={{ width: 20, height: 20 }} />;
    }
  };

  const filteredCandidates = agentData?.myCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.company.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
              {user?.firstName?.charAt(0) || 'A'}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome, {user?.firstName || 'Agent'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Manage your candidates and track your success
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
                Add New Candidate
              </Button>
              <Button
                variant="outlined"
                startIcon={<ChartBarIcon style={{ width: 20, height: 20 }} />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                View Reports
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {agentData.stats.map((stat, index) => (
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
                      backgroundColor: theme.palette.success.light,
                      color: theme.palette.success.dark,
                      fontWeight: 600,
                    }}
                  />
                  <ArrowTrendingUpIcon
                    style={{
                      width: 16,
                      height: 16,
                      color: theme.palette.success.main,
                      marginLeft: 8,
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
          <Tab label="My Candidates" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Charts Section */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                {/* Placement Trends Chart */}
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Placement Trends & Commission
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={agentData.placementTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.grey[200]} />
                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                        <YAxis stroke={theme.palette.text.secondary} />
                        <RechartsTooltip />
                        <Line
                          type="monotone"
                          dataKey="placements"
                          stroke={theme.palette.primary.main}
                          strokeWidth={3}
                          dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Candidate Status Distribution
                    </Typography>
                    <Grid container spacing={2}>
                      {agentData.statusDistribution.map((status, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
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
                              <Typography variant="body2" color="text.secondary">
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
                {/* Recent Activities */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Recent Activities
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {agentData.recentActivities.map((activity, index) => (
                        <React.Fragment key={activity.id}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  backgroundColor:
                                    activity.type === 'placement' ? theme.palette.success.light :
                                    activity.type === 'submission' ? theme.palette.info.light :
                                    activity.type === 'interview' ? theme.palette.warning.light :
                                    theme.palette.primary.light,
                                  color:
                                    activity.type === 'placement' ? theme.palette.success.main :
                                    activity.type === 'submission' ? theme.palette.info.main :
                                    activity.type === 'interview' ? theme.palette.warning.main :
                                    theme.palette.primary.main,
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {getActivityIcon(activity.type)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {activity.message}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {activity.time}
                                  {activity.company && ` • ${activity.company}`}
                                  {activity.earnings && (
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{ color: theme.palette.success.main, fontWeight: 600 }}
                                    >
                                      {` • ${activity.earnings}`}
                                    </Typography>
                                  )}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < agentData.recentActivities.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      This Month
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Placements Made</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          8
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Commission Earned</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                          $9,200
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">New Candidates</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          12
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Success Rate</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                          67%
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* My Candidates Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MagnifyingGlassIcon style={{ width: 20, height: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
                  >
                    Add Candidate
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 600 }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Submission Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Commission</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate) => (
                    <TableRow key={candidate.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.light }}>
                            {candidate.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {candidate.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {candidate.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {candidate.jobTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {candidate.company}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={candidate.status}
                          sx={{
                            bgcolor: getStatusColor(candidate.status).light,
                            color: getStatusColor(candidate.status).dark,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {candidate.submissionDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                          {candidate.expectedCommission}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <EyeIcon style={{ width: 18, height: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Contact">
                            <IconButton size="small">
                              <PhoneIcon style={{ width: 18, height: 18 }} />
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
              count={filteredCandidates.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="body1" color="text.secondary">
            Advanced analytics and reporting interface for agent performance tracking.
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AgentDashboard;
