import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Tabs,
  Tab,
  Badge,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  AccessTime as LateIcon,
  School as CourseIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Gavel as AppealIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import adminService from '../../api/admin';
import attendanceAppealService from '../../api/attendanceAppeal';
import ReviewAppealDialog from '../../components/attendance/ReviewAppealDialog';

const TrainerAttendance = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [candidates, setCandidates] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState({});
  const [sessionNumber, setSessionNumber] = useState(1);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [appeals, setAppeals] = useState([]);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [statistics, setStatistics] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });

  useEffect(() => {
    fetchMyCourses();
    fetchAppeals();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchCandidates();
      fetchExistingAttendance();
    }
  }, [selectedCourse, selectedDate]);

  useEffect(() => {
    calculateStatistics();
  }, [attendance, candidates]);

  const fetchMyCourses = async () => {
    try {
      // In a real scenario, this would fetch courses assigned to the trainer
      const response = await adminService.getAllCourses({ status: 'ACTIVE' });
      const coursesData = response?.data?.data || response?.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      enqueueSnackbar('Failed to load courses', { variant: 'error' });
    }
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await adminService.getEnrollments();
      const enrollmentsData = response?.data?.data?.enrollments || [];

      const courseCandidates = enrollmentsData
        .filter(e => e.courseId === parseInt(selectedCourse) && e.enrollmentStatus === 'ENROLLED')
        .map(e => ({
          id: e.candidateId,
          enrollmentId: e.id,
          fullName: e.candidate?.fullName || 'Unknown',
          email: e.candidate?.user?.email || '',
        }));

      setCandidates(courseCandidates);

      const initialAttendance = {};
      courseCandidates.forEach(c => {
        if (!attendance[c.id]) {
          initialAttendance[c.id] = null;
        }
      });
      setAttendance(prev => ({ ...prev, ...initialAttendance }));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      enqueueSnackbar('Failed to load candidates', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const response = await adminService.getAttendance(selectedCourse, selectedDate);
      const attendanceData = response?.data?.data || response?.data || [];

      const existingAttendance = {};
      const existingRemarks = {};

      attendanceData.forEach(record => {
        existingAttendance[record.candidateId] = record.status;
        existingRemarks[record.candidateId] = record.remarks || '';
      });

      setAttendance(existingAttendance);
      setRemarks(existingRemarks);

      if (attendanceData.length > 0) {
        setSessionNumber(attendanceData[0].sessionNumber || 1);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const calculateStatistics = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      total: candidates.length,
    };

    Object.values(attendance).forEach(status => {
      if (status === 'PRESENT') stats.present++;
      else if (status === 'ABSENT') stats.absent++;
      else if (status === 'LATE') stats.late++;
    });

    setStatistics(stats);
  };

  const handleAttendanceChange = (candidateId, status) => {
    setAttendance(prev => ({
      ...prev,
      [candidateId]: prev[candidateId] === status ? null : status,
    }));
  };

  const handleRemarksChange = (candidateId, value) => {
    setRemarks(prev => ({
      ...prev,
      [candidateId]: value,
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    candidates.forEach(c => {
      allPresent[c.id] = 'PRESENT';
    });
    setAttendance(allPresent);
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(true);

      const records = candidates
        .filter(c => attendance[c.id])
        .map(c => ({
          candidateId: c.id,
          courseId: parseInt(selectedCourse),
          sessionDate: selectedDate,
          sessionNumber: sessionNumber,
          status: attendance[c.id],
          remarks: remarks[c.id] || '',
        }));

      if (records.length === 0) {
        enqueueSnackbar('Please mark attendance for at least one candidate', { variant: 'warning' });
        return;
      }

      await adminService.saveAttendance({ records });

      enqueueSnackbar(`Attendance saved for ${records.length} candidates`, { variant: 'success' });
      setSaveDialogOpen(false);
    } catch (error) {
      console.error('Error saving attendance:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save attendance', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppeals = async () => {
    try {
      const response = await attendanceAppealService.getTrainerAppeals({ status: 'PENDING' });
      setAppeals(response?.data || []);
    } catch (error) {
      console.error('Error fetching appeals:', error);
    }
  };

  const handleReviewAppeal = (appeal) => {
    setSelectedAppeal(appeal);
    setReviewDialogOpen(true);
  };

  const handleReviewComplete = () => {
    fetchAppeals();
    if (selectedCourse) {
      fetchExistingAttendance();
    }
  };

  const pendingAppealsCount = appeals.filter(a => a.status === 'PENDING').length;

  const exportToCSV = () => {
    const courseName = courses.find(c => c.id === parseInt(selectedCourse))?.title || 'Course';
    const headers = ['Candidate ID', 'Name', 'Email', 'Status', 'Remarks'];
    const rows = candidates.map(c => [
      c.id,
      c.fullName,
      c.email,
      attendance[c.id] || 'NOT_MARKED',
      remarks[c.id] || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${courseName}_${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'success';
      case 'ABSENT': return 'error';
      case 'LATE': return 'warning';
      default: return 'default';
    }
  };

  const attendancePercentage = statistics.total > 0
    ? Math.round((statistics.present / statistics.total) * 100)
    : 0;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Mark Attendance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track student attendance for your training sessions
          </Typography>
        </div>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
            disabled={!selectedCourse || candidates.length === 0}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setSaveDialogOpen(true)}
            disabled={!selectedCourse || Object.keys(attendance).filter(k => attendance[k]).length === 0}
          >
            Save Attendance
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Mark Attendance" icon={<PresentIcon />} iconPosition="start" />
          <Tab
            label={
              <Badge badgeContent={pendingAppealsCount} color="error">
                Appeals
              </Badge>
            }
            icon={<AppealIcon />}
            iconPosition="start"
          />
          <Tab label="Attendance History" icon={<HistoryIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>My Course</InputLabel>
                    <Select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      label="My Course"
                    >
                      <MenuItem value="">
                        <em>Select a course</em>
                      </MenuItem>
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.title} ({course.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Session Date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Session #"
                    value={sessionNumber}
                    onChange={(e) => setSessionNumber(parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={markAllPresent}
                    disabled={!selectedCourse || candidates.length === 0}
                    sx={{ height: '56px' }}
                  >
                    Mark All Present
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Statistics */}
          {selectedCourse && candidates.length > 0 && (
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      <div>
                        <Typography variant="h4">{statistics.total}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Students
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PresentIcon sx={{ fontSize: 40, color: 'success.main' }} />
                      <div>
                        <Typography variant="h4" color="success.main">
                          {statistics.present}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Present ({attendancePercentage}%)
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LateIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                      <div>
                        <Typography variant="h4" color="warning.main">
                          {statistics.late}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Late
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <AbsentIcon sx={{ fontSize: 40, color: 'error.main' }} />
                      <div>
                        <Typography variant="h4" color="error.main">
                          {statistics.absent}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Absent
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Attendance Table */}
          <Card>
            <CardContent>
              {!selectedCourse ? (
                <Box py={8} textAlign="center">
                  <CourseIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a Course
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose your course and session date to mark attendance
                  </Typography>
                </Box>
              ) : loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : candidates.length === 0 ? (
                <Box py={8} textAlign="center">
                  <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Students Enrolled
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    There are no students enrolled in this course yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="50">#</TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="center">Mark Attendance</TableCell>
                        <TableCell>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {candidates.map((candidate, index) => (
                        <TableRow key={candidate.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {candidate.fullName?.charAt(0) || 'S'}
                              </Avatar>
                              <Typography variant="body1" fontWeight={500}>
                                {candidate.fullName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{candidate.email}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <ToggleButtonGroup
                              value={attendance[candidate.id]}
                              exclusive
                              onChange={(e, value) => value && handleAttendanceChange(candidate.id, value)}
                              size="small"
                            >
                              <ToggleButton value="PRESENT" color="success">
                                <Tooltip title="Present">
                                  <PresentIcon />
                                </Tooltip>
                              </ToggleButton>
                              <ToggleButton value="LATE" color="warning">
                                <Tooltip title="Late">
                                  <LateIcon />
                                </Tooltip>
                              </ToggleButton>
                              <ToggleButton value="ABSENT" color="error">
                                <Tooltip title="Absent">
                                  <AbsentIcon />
                                </Tooltip>
                              </ToggleButton>
                            </ToggleButtonGroup>
                            {attendance[candidate.id] && (
                              <Chip
                                label={attendance[candidate.id]}
                                color={getStatusColor(attendance[candidate.id])}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="Add remarks..."
                              value={remarks[candidate.id] || ''}
                              onChange={(e) => handleRemarksChange(candidate.id, e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Pending Appeals</Typography>
              <IconButton onClick={fetchAppeals} size="small">
                <RefreshIcon />
              </IconButton>
            </Box>

            {appeals.length === 0 ? (
              <Alert severity="info">
                <Typography variant="body2">
                  No pending appeals at the moment. Appeals from students will appear here.
                </Typography>
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Original Status</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appeals.map((appeal) => (
                      <TableRow key={appeal.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {appeal.candidate?.fullName || 
                             `${appeal.candidate?.user?.firstName} ${appeal.candidate?.user?.lastName}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appeal.candidate?.user?.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {appeal.attendanceRecord?.course?.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(new Date(appeal.attendanceRecord?.date), 'MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appeal.originalStatus}
                            size="small"
                            color={appeal.originalStatus === 'ABSENT' ? 'error' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {appeal.reason.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(appeal.createdAt), 'MMM dd, hh:mm a')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<AppealIcon />}
                            onClick={() => handleReviewAppeal(appeal)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Box py={8} textAlign="center">
              <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Attendance History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View past attendance records and reports
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Save Confirmation Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Attendance</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Saving attendance for <strong>{Object.keys(attendance).filter(k => attendance[k]).length}</strong> students
          </Alert>
          <Typography variant="body2">
            Course: <strong>{courses.find(c => c.id === parseInt(selectedCourse))?.title}</strong>
          </Typography>
          <Typography variant="body2">
            Date: <strong>{format(new Date(selectedDate), 'MMMM dd, yyyy')}</strong>
          </Typography>
          <Typography variant="body2">
            Session: <strong>#{sessionNumber}</strong>
          </Typography>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              • Present: {statistics.present}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Late: {statistics.late}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Absent: {statistics.absent}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveAttendance}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Appeal Dialog */}
      <ReviewAppealDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        appeal={selectedAppeal}
        onReviewComplete={handleReviewComplete}
        isAdmin={false}
      />
    </Box>
  );
};

export default TrainerAttendance;
