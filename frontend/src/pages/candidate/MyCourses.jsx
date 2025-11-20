import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  School as CourseIcon,
  CalendarToday as CalendarIcon,
  Person as TrainerIcon,
  LocationOn as LocationIcon,
  CheckCircle as CompletedIcon,
  Schedule as InProgressIcon,
  HourglassEmpty as PendingIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import candidateService from '../../api/candidate';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
    if (tabValue === 1) {
      fetchAvailableCourses();
    }
  }, [tabValue]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getMyCourses();
      console.log('📚 Fetched my courses:', response);
      setCourses(response || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      enqueueSnackbar('Failed to load courses', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getAvailableCourses();
      setAvailableCourses(response || []);
    } catch (error) {
      console.error('Error fetching available courses:', error);
      enqueueSnackbar('Failed to load available courses', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;

    try {
      setEnrolling(true);
      await candidateService.enrollInCourse(selectedCourse.id);
      enqueueSnackbar('Successfully enrolled in course!', { variant: 'success' });
      setEnrollDialogOpen(false);
      setSelectedCourse(null);
      fetchMyCourses();
      fetchAvailableCourses();
    } catch (error) {
      console.error('Error enrolling:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to enroll in course', { variant: 'error' });
    } finally {
      setEnrolling(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ENROLLED: 'primary',
      COMPLETED: 'success',
      APPLIED: 'warning',
      WAITLISTED: 'info',
      WITHDRAWN: 'error',
      REJECTED: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      ENROLLED: <InProgressIcon />,
      COMPLETED: <CompletedIcon />,
      APPLIED: <PendingIcon />,
      WAITLISTED: <PendingIcon />,
    };
    return icons[status] || <PendingIcon />;
  };

  const calculateProgress = (course) => {
    // Use backend-calculated progress if available
    if (course.progress !== undefined) {
      return course.progress;
    }

    if (course.status === 'COMPLETED') return 100;
    if (course.status === 'ENROLLED') {
      // Calculate based on course duration
      if (course.startDate && course.endDate) {
        const now = new Date();
        const start = new Date(course.startDate);
        const end = new Date(course.endDate);
        const total = end - start;
        const elapsed = now - start;
        return Math.min(Math.max((elapsed / total) * 100, 0), 100);
      }
      return 30; // Default progress
    }
    return 0;
  };

  const renderEnrolledCourses = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      );
    }

    if (courses.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <CourseIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Enrolled Courses
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            You haven't enrolled in any courses yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTabValue(1)}
          >
            Browse Available Courses
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {courses.map((course) => {
          const progress = calculateProgress(course);

          return (
            <Grid item xs={12} md={6} key={course.enrollmentId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {course.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.code}
                      </Typography>
                    </Box>
                    <Chip
                      label={course.status}
                      color={getStatusColor(course.status)}
                      size="small"
                      icon={getStatusIcon(course.status)}
                    />
                  </Box>

                  {course.category && (
                    <Chip label={course.category} size="small" sx={{ mb: 2 }} />
                  )}

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {course.description || 'No description available'}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <TrainerIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Instructor"
                        secondary={course.instructor}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CalendarIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Duration"
                        secondary={
                          course.startDate && course.endDate
                            ? `${format(new Date(course.startDate), 'MMM dd, yyyy')} - ${format(new Date(course.endDate), 'MMM dd, yyyy')}`
                            : `${course.durationDays || 'N/A'} days`
                        }
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocationIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={course.location || 'To be announced'}
                      />
                    </ListItem>
                  </List>

                  <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Overall Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {course.attendanceRate !== undefined && (
                    <Box mt={2} display="flex" gap={2}>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          Attendance
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {course.attendanceRate}%
                        </Typography>
                      </Box>
                      {course.assessments && (
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary">
                            Assessments
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {course.assessments.completed}/{course.assessments.total}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => navigate(`/candidate/courses/${course.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderAvailableCourses = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      );
    }

    if (availableCourses.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <CourseIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Available Courses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no courses available for enrollment at the moment
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {availableCourses.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {course.code}
                    </Typography>
                  </Box>
                  <Chip
                    label={course.status || 'ACTIVE'}
                    color="success"
                    size="small"
                  />
                </Box>

                {course.category && (
                  <Chip label={course.category} size="small" sx={{ mb: 2 }} />
                )}

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {course.description || 'No description available'}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <List dense>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <TrainerIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Instructor"
                      secondary={course.instructor}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CalendarIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Start Date"
                      secondary={
                        course.startDate
                          ? format(new Date(course.startDate), 'MMM dd, yyyy')
                          : 'To be announced'
                      }
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <InProgressIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Duration"
                      secondary={`${course.durationDays || 'N/A'} days`}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LocationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={course.location || 'To be announced'}
                    />
                  </ListItem>
                  {course.capacity && (
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <GroupIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Available Seats"
                        secondary={
                          course.availableSeats !== null
                            ? `${course.availableSeats} of ${course.capacity}`
                            : `${course.capacity} total`
                        }
                      />
                    </ListItem>
                  )}
                  {course.enrollmentCount !== undefined && (
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <GroupIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Enrolled Students"
                        secondary={course.enrollmentCount}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedCourse(course);
                    setEnrollDialogOpen(true);
                  }}
                  fullWidth
                  disabled={course.availableSeats === 0}
                >
                  {course.availableSeats === 0 ? 'Full' : 'Enroll Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          My Courses
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your course enrollments and browse available courses
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Enrolled Courses
              </Typography>
              <Typography variant="h4">
                {courses.filter(e => e.status === 'ENROLLED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Completed
              </Typography>
              <Typography variant="h4" color="success.main">
                {courses.filter(e => e.status === 'COMPLETED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                In Progress
              </Typography>
              <Typography variant="h4" color="primary.main">
                {courses.filter(e => e.status === 'ENROLLED').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Available Courses
              </Typography>
              <Typography variant="h4" color="info.main">
                {availableCourses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="My Enrollments" />
          <Tab label="Available Courses" />
        </Tabs>
      </Paper>

      {/* Content */}
      <Box>
        {tabValue === 0 && renderEnrolledCourses()}
        {tabValue === 1 && renderAvailableCourses()}
      </Box>

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={enrollDialogOpen} onClose={() => !enrolling && setEnrollDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedCourse.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedCourse.description}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                By enrolling, you agree to attend all sessions and complete all required assessments.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialogOpen(false)} disabled={enrolling}>
            Cancel
          </Button>
          <Button onClick={handleEnroll} variant="contained" disabled={enrolling}>
            {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyCourses;
