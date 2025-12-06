import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Refresh,
  Download,
  PersonAdd,
  Event,
  Assessment as AssessmentIcon,
  School,
  CheckCircle,
  Groups,
  TrendingUp,
} from '@mui/icons-material';
import { cohortService } from '../../api/cohort';
import { adminService } from '../../api/admin';
import { format } from 'date-fns';

const CohortDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cohort, setCohort] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [enrollDialog, setEnrollDialog] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('ENROLLED');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCohortDetails();
    fetchCandidates();
  }, [id]);

  const fetchCohortDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cohortRes, progressRes] = await Promise.all([
        cohortService.getCohortById(id),
        cohortService.getCohortProgress(id),
      ]);
      setCohort(cohortRes.data);
      setProgress(progressRes.data);
    } catch (err) {
      console.error('Error fetching cohort details:', err);
      setError(err.response?.data?.message || 'Failed to fetch cohort details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await adminService.getAllCandidates({ limit: 1000 });
      setCandidates(response.data.candidates || []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    }
  };

  const handleEnrollStudent = async () => {
    try {
      setActionLoading(true);
      await cohortService.enrollStudent(id, {
        candidateId: parseInt(selectedCandidate),
        enrollmentStatus,
      });
      setSuccess('Student enrolled successfully');
      setEnrollDialog(false);
      setSelectedCandidate('');
      fetchCohortDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await cohortService.exportCohortData(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cohort_${cohort.cohortCode}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('Cohort data exported successfully');
    } catch (err) {
      setError('Failed to export cohort data');
    }
  };

  const handleUpdateMetrics = async () => {
    try {
      setActionLoading(true);
      await cohortService.updateCohortMetrics(id);
      setSuccess('Metrics updated successfully');
      fetchCohortDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update metrics');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PUBLISHED: 'info',
      ENROLLMENT_OPEN: 'success',
      ENROLLMENT_CLOSED: 'warning',
      IN_TRAINING: 'primary',
      ASSESSMENT_IN_PROGRESS: 'secondary',
      VETTING_IN_PROGRESS: 'secondary',
      COMPLETED: 'success',
      ARCHIVED: 'default',
    };
    return colors[status] || 'default';
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
  };

  const formatDateTime = (date) => {
    return date ? format(new Date(date), 'MMM dd, yyyy HH:mm') : 'N/A';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cohort) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Cohort not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate('/admin/cohorts')}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {cohort.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cohort.cohortCode}
          </Typography>
        </Box>
        <Chip
          label={cohort.status.replace(/_/g, ' ')}
          color={getStatusColor(cohort.status)}
        />
        {cohort.status === 'DRAFT' && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/admin/cohorts/${id}/edit`)}
          >
            Edit
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export
        </Button>
        <IconButton onClick={fetchCohortDetails}>
          <Refresh />
        </IconButton>
      </Stack>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Overview Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Enrolled Students
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {cohort.enrolledCount || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    of {cohort.maxCapacity} capacity
                  </Typography>
                </Box>
                <Groups sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Stack>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={((cohort.enrolledCount || 0) / cohort.maxCapacity) * 100}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg Attendance
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {progress?.attendanceStats?.averageAttendanceRate?.toFixed(1) || 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {progress?.attendanceStats?.totalSessionsCompleted || 0} sessions
                  </Typography>
                </Box>
                <Event sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Avg Assessment
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {progress?.assessmentProgress?.averageScore?.toFixed(1) || 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {progress?.assessmentProgress?.totalAssessments || 0} assessments
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Placement Ready
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {progress?.placementReadiness?.readyCount || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {progress?.placementReadiness?.readinessRate?.toFixed(1) || 0}% ready
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cohort Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Cohort Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Course</Typography>
            <Typography variant="body1" fontWeight="medium">
              {cohort.course?.name || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">Lead Trainer</Typography>
            <Typography variant="body1" fontWeight="medium">
              {cohort.leadTrainer
                ? `${cohort.leadTrainer.firstName} ${cohort.leadTrainer.lastName}`
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">Start Date</Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(cohort.startDate)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">End Date</Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(cohort.endDate)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">Enrollment Deadline</Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(cohort.enrollmentDeadline)}
            </Typography>
          </Grid>
          {cohort.description && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Description</Typography>
              <Typography variant="body1">{cohort.description}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Enrollments" />
          <Tab label="Sessions" />
          <Tab label="Performance Metrics" />
        </Tabs>
        <Divider />

        {/* Enrollments Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Enrolled Students ({progress?.enrollments?.length || 0})
              </Typography>
              {cohort.status === 'ENROLLMENT_OPEN' && (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setEnrollDialog(true)}
                >
                  Enroll Student
                </Button>
              )}
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Enrollment Date</TableCell>
                    <TableCell align="center">Attendance</TableCell>
                    <TableCell align="center">Assessments</TableCell>
                    <TableCell>Vetting Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progress?.enrollments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary">No students enrolled yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    progress?.enrollments?.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          {enrollment.candidate
                            ? `${enrollment.candidate.firstName} ${enrollment.candidate.lastName}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{enrollment.candidate?.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={enrollment.enrollmentStatus.replace(/_/g, ' ')}
                            size="small"
                            color={enrollment.enrollmentStatus === 'COMPLETED' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{formatDate(enrollment.enrolledAt)}</TableCell>
                        <TableCell align="center">
                          {enrollment.attendanceRate?.toFixed(1) || 0}%
                        </TableCell>
                        <TableCell align="center">
                          {enrollment.averageAssessmentScore?.toFixed(1) || 0}%
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={enrollment.vettingStatus || 'Pending'}
                            size="small"
                            color={enrollment.vettingStatus === 'APPROVED' ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Sessions Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Training Sessions
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleUpdateMetrics}
                disabled={actionLoading}
              >
                Update Metrics
              </Button>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Session #</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Attendance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cohort.sessions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No sessions scheduled yet</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    cohort.sessions?.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.sessionNumber}</TableCell>
                        <TableCell>{session.topic || 'N/A'}</TableCell>
                        <TableCell>{formatDateTime(session.scheduledAt)}</TableCell>
                        <TableCell>{session.durationMinutes} min</TableCell>
                        <TableCell>
                          <Chip
                            label={session.status.replace(/_/g, ' ')}
                            size="small"
                            color={session.status === 'COMPLETED' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {session.status === 'COMPLETED'
                            ? `${session.attendanceCount || 0} / ${cohort.enrolledCount || 0}`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Performance Metrics Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Attendance Statistics
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Average Attendance Rate
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {progress?.attendanceStats?.averageAttendanceRate?.toFixed(1) || 0}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress?.attendanceStats?.averageAttendanceRate || 0}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Sessions Completed
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {progress?.attendanceStats?.totalSessionsCompleted || 0}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Assessment Performance
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Average Score
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {progress?.assessmentProgress?.averageScore?.toFixed(1) || 0}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress?.assessmentProgress?.averageScore || 0}
                        sx={{ mt: 1 }}
                        color="warning"
                      />
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Completion Rate
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {progress?.assessmentProgress?.completionRate?.toFixed(1) || 0}%
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Vetting Progress
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Approved
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        {progress?.vettingProgress?.approvedCount || 0}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pending
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="warning.main">
                        {progress?.vettingProgress?.pendingCount || 0}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Rejected
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="error.main">
                        {progress?.vettingProgress?.rejectedCount || 0}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Placement Readiness
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ready for Placement
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {progress?.placementReadiness?.readyCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {progress?.placementReadiness?.readinessRate?.toFixed(1) || 0}% of total
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Not Ready
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {progress?.placementReadiness?.notReadyCount || 0}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Enroll Student Dialog */}
      <Dialog
        open={enrollDialog}
        onClose={() => setEnrollDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enroll Student</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Select Student"
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              fullWidth
            >
              {candidates.map((candidate) => (
                <MenuItem key={candidate.id} value={candidate.id}>
                  {candidate.firstName} {candidate.lastName} ({candidate.email})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Enrollment Status"
              value={enrollmentStatus}
              onChange={(e) => setEnrollmentStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="ENROLLED">Enrolled</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialog(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEnrollStudent}
            variant="contained"
            disabled={!selectedCandidate || actionLoading}
          >
            {actionLoading ? 'Enrolling...' : 'Enroll'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CohortDetails;
