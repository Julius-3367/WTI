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
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  TrophyIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  PresentationChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolid,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AcademicCapIcon as AcademicCapSolid,
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
    id={`trainer-tabpanel-${index}`}
    aria-labelledby={`trainer-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </Box>
);

const TrainerDashboard = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Mock trainer data
  const [trainerData, setTrainerData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setTrainerData({
        stats: [
          {
            title: 'Active Courses',
            value: '8',
            change: '+2',
            trend: 'up',
            icon: AcademicCapIcon,
            color: theme.palette.primary.main,
          },
          {
            title: 'Total Students',
            value: '156',
            change: '+12',
            trend: 'up',
            icon: UserGroupIcon,
            color: theme.palette.info.main,
          },
          {
            title: 'Completion Rate',
            value: '89%',
            change: '+5%',
            trend: 'up',
            icon: CheckCircleIcon,
            color: theme.palette.success.main,
          },
          {
            title: 'Avg. Score',
            value: '85.4',
            change: '+3.2',
            trend: 'up',
            icon: TrophyIcon,
            color: theme.palette.secondary.main,
          },
        ],
        courses: [
          {
            id: 1,
            title: 'Construction Safety Training',
            code: 'CST-101',
            students: 25,
            status: 'Active',
            progress: 75,
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            sessions: 12,
            completedSessions: 9,
            nextSession: '2024-01-28 09:00',
          },
          {
            id: 2,
            title: 'Electrical Installation Basics',
            code: 'EIB-201',
            students: 18,
            status: 'Active',
            progress: 60,
            startDate: '2024-01-20',
            endDate: '2024-02-20',
            sessions: 15,
            completedSessions: 9,
            nextSession: '2024-01-29 10:00',
          },
          {
            id: 3,
            title: 'Heavy Machinery Operation',
            code: 'HMO-301',
            students: 22,
            status: 'Completed',
            progress: 100,
            startDate: '2023-12-01',
            endDate: '2024-01-15',
            sessions: 20,
            completedSessions: 20,
            nextSession: null,
          },
          {
            id: 4,
            title: 'Workplace Communication Skills',
            code: 'WCS-401',
            students: 30,
            status: 'Scheduled',
            progress: 0,
            startDate: '2024-02-01',
            endDate: '2024-03-01',
            sessions: 8,
            completedSessions: 0,
            nextSession: '2024-02-01 14:00',
          },
        ],
        students: [
          {
            id: 1,
            name: 'Ahmed Hassan',
            email: 'ahmed.hassan@email.com',
            course: 'Construction Safety Training',
            attendance: 92,
            progress: 85,
            lastScore: 88,
            status: 'Active',
            enrollDate: '2024-01-15',
          },
          {
            id: 2,
            name: 'Sarah Al-Mahmoud',
            email: 'sarah.mahmoud@email.com',
            course: 'Electrical Installation Basics',
            attendance: 95,
            progress: 78,
            lastScore: 91,
            status: 'Active',
            enrollDate: '2024-01-20',
          },
          {
            id: 3,
            name: 'Mohammad Khalil',
            email: 'mohammad.khalil@email.com',
            course: 'Heavy Machinery Operation',
            attendance: 100,
            progress: 100,
            lastScore: 94,
            status: 'Completed',
            enrollDate: '2023-12-01',
          },
          {
            id: 4,
            name: 'Fatima Al-Zahra',
            email: 'fatima.zahra@email.com',
            course: 'Construction Safety Training',
            attendance: 88,
            progress: 72,
            lastScore: 82,
            status: 'Active',
            enrollDate: '2024-01-15',
          },
        ],
        recentActivity: [
          {
            id: 1,
            type: 'assessment',
            message: 'Graded Construction Safety assessment - 25 students',
            course: 'Construction Safety Training',
            time: '2 hours ago',
            score: '85.2',
          },
          {
            id: 2,
            type: 'session',
            message: 'Completed session 9 - Electrical Installation Basics',
            course: 'Electrical Installation Basics',
            time: '1 day ago',
            attendance: '17/18',
          },
          {
            id: 3,
            type: 'completion',
            message: 'Mohammad Khalil completed Heavy Machinery Operation',
            course: 'Heavy Machinery Operation',
            time: '2 days ago',
            score: '94',
          },
          {
            id: 4,
            type: 'schedule',
            message: 'Scheduled new course: Workplace Communication Skills',
            time: '3 days ago',
            students: '30',
          },
        ],
        progressTrends: [
          { month: 'Jul', completed: 45, enrolled: 52 },
          { month: 'Aug', completed: 38, enrolled: 48 },
          { month: 'Sep', completed: 52, enrolled: 58 },
          { month: 'Oct', completed: 47, enrolled: 55 },
          { month: 'Nov', completed: 41, enrolled: 46 },
          { month: 'Dec', completed: 56, enrolled: 62 },
        ],
        performanceMetrics: [
          {
            category: 'Excellent (90-100)',
            students: 42,
            color: theme.palette.success.main,
          },
          {
            category: 'Good (80-89)',
            students: 68,
            color: theme.palette.info.main,
          },
          {
            category: 'Satisfactory (70-79)',
            students: 34,
            color: theme.palette.warning.main,
          },
          {
            category: 'Needs Improvement (<70)',
            students: 12,
            color: theme.palette.error.main,
          },
        ],
        todaySchedule: [
          {
            time: '09:00',
            course: 'Construction Safety Training',
            session: 'Session 10 - Emergency Procedures',
            room: 'Room 201',
            students: 25,
          },
          {
            time: '11:00',
            course: 'Electrical Installation Basics',
            session: 'Session 10 - Circuit Testing',
            room: 'Lab 103',
            students: 18,
          },
          {
            time: '14:00',
            course: 'Heavy Machinery Operation',
            session: 'Final Assessment Review',
            room: 'Workshop A',
            students: 22,
          },
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
      case 'Completed':
        return theme.palette.primary;
      case 'Scheduled':
        return theme.palette.warning;
      default:
        return theme.palette.grey;
    }
  };

  const getActivityIcon = type => {
    switch (type) {
      case 'assessment':
        return <DocumentCheckIcon style={{ width: 20, height: 20 }} />;
      case 'session':
        return <AcademicCapSolid style={{ width: 20, height: 20 }} />;
      case 'completion':
        return <CheckCircleSolid style={{ width: 20, height: 20 }} />;
      case 'schedule':
        return <CalendarIcon style={{ width: 20, height: 20 }} />;
      default:
        return <ClockIcon style={{ width: 20, height: 20 }} />;
    }
  };

  const handleCourseView = course => {
    setSelectedCourse(course);
    setCourseDialogOpen(true);
  };

  const filteredCourses =
    trainerData?.courses.filter(
      course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredStudents =
    trainerData?.students.filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse =
        filterCourse === 'all' || student.course === filterCourse;
      return matchesSearch && matchesCourse;
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
              {user?.firstName?.charAt(0) || 'T'}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Welcome, Dr. {user?.firstName || 'Trainer'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Manage your courses and track student progress
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
                Create Course
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
        {trainerData.stats.map((stat, index) => (
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
          <Tab label="My Courses" />
          <Tab label="Students" />
          <Tab label="Schedule" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Charts Section */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                {/* Progress Trends Chart */}
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Student Progress Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trainerData.progressTrends}>
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
                          dataKey="enrolled"
                          stackId="1"
                          stroke={theme.palette.info.main}
                          fill={theme.palette.info.main}
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stackId="2"
                          stroke={theme.palette.success.main}
                          fill={theme.palette.success.main}
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Performance Distribution */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Student Performance Distribution
                    </Typography>
                    <Grid container spacing={2}>
                      {trainerData.performanceMetrics.map((metric, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: metric.color,
                                mr: 2,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {metric.category}
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {metric.students} students
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
                {/* Today's Schedule */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Today's Schedule
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {trainerData.todaySchedule.map((session, index) => (
                        <React.Fragment key={index}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  backgroundColor: theme.palette.primary.light,
                                  color: theme.palette.primary.main,
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                <ClockIcon style={{ width: 16, height: 16 }} />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {session.time} - {session.course}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {session.session} • {session.room} •{' '}
                                  {session.students} students
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < trainerData.todaySchedule.length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {trainerData.recentActivity
                        .slice(0, 4)
                        .map((activity, index) => (
                          <React.Fragment key={activity.id}>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    backgroundColor:
                                      activity.type === 'completion'
                                        ? theme.palette.success.light
                                        : activity.type === 'assessment'
                                          ? theme.palette.info.light
                                          : activity.type === 'session'
                                            ? theme.palette.primary.light
                                            : theme.palette.warning.light,
                                    color:
                                      activity.type === 'completion'
                                        ? theme.palette.success.main
                                        : activity.type === 'assessment'
                                          ? theme.palette.info.main
                                          : activity.type === 'session'
                                            ? theme.palette.primary.main
                                            : theme.palette.warning.main,
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
                                    {activity.course && ` • ${activity.course}`}
                                    {activity.score && (
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{
                                          color: theme.palette.success.main,
                                          fontWeight: 600,
                                          ml: 1,
                                        }}
                                      >
                                        • Avg: {activity.score}
                                      </Typography>
                                    )}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            {index < trainerData.recentActivity.length - 1 && (
                              <Divider />
                            )}
                          </React.Fragment>
                        ))}
                    </List>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* My Courses Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Search courses..."
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
                    Create Course
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {filteredCourses.map(course => (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
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
                        {course.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={course.status}
                        sx={{
                          bgcolor: getStatusColor(course.status).light,
                          color: getStatusColor(course.status).dark,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Code: {course.code} • {course.students} students
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {course.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getStatusColor(course.status).main,
                          },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 2, display: 'block' }}
                    >
                      Sessions: {course.completedSessions}/{course.sessions}
                    </Typography>
                    {course.nextSession && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 2, display: 'block' }}
                      >
                        Next: {course.nextSession}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleCourseView(course)}
                      >
                        View Details
                      </Button>
                      <Button size="small" variant="text">
                        Manage
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Students Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Search students..."
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
                  <InputLabel>Filter by Course</InputLabel>
                  <Select
                    value={filterCourse}
                    onChange={e => setFilterCourse(e.target.value)}
                    label="Filter by Course"
                  >
                    <MenuItem value="all">All Courses</MenuItem>
                    <MenuItem value="Construction Safety Training">
                      Construction Safety Training
                    </MenuItem>
                    <MenuItem value="Electrical Installation Basics">
                      Electrical Installation Basics
                    </MenuItem>
                    <MenuItem value="Heavy Machinery Operation">
                      Heavy Machinery Operation
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Attendance</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(student => (
                    <TableRow key={student.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{ mr: 2, bgcolor: theme.palette.primary.light }}
                          >
                            {student.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {student.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.course}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Enrolled: {student.enrollDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={student.progress}
                            sx={{
                              width: 60,
                              height: 8,
                              borderRadius: 4,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {student.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {student.attendance}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.success.main,
                          }}
                        >
                          {student.lastScore}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={student.status}
                          sx={{
                            bgcolor: getStatusColor(student.status).light,
                            color: getStatusColor(student.status).dark,
                            fontWeight: 500,
                          }}
                        />
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
              count={filteredStudents.length}
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

        {/* Schedule Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="body1" color="text.secondary">
            Detailed schedule management interface for course sessions and
            activities.
          </Typography>
        </TabPanel>
      </Paper>

      {/* Course Details Dialog */}
      <Dialog
        open={courseDialogOpen}
        onClose={() => setCourseDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {selectedCourse.title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Course Code
                  </Typography>
                  <Typography variant="body1">{selectedCourse.code}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Students Enrolled
                  </Typography>
                  <Typography variant="body1">
                    {selectedCourse.students}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedCourse.startDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedCourse.endDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Sessions
                  </Typography>
                  <Typography variant="body1">
                    {selectedCourse.sessions}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body1">
                    {selectedCourse.progress}%
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCourseDialogOpen(false)}>Close</Button>
              <Button variant="contained">Manage Course</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default TrainerDashboard;
