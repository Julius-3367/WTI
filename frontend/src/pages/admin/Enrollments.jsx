import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
  Alert,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import adminService from '../../api/admin';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      console.log('Fetching enrollments with filter:', filter);

      const statusParam = filter !== 'ALL' ? filter : undefined;
      console.log('Status parameter:', statusParam);

      const response = await adminService.getEnrollments(statusParam);
      console.log('Full API Response:', response);

      // Backend returns: { success: true, data: { enrollments: [...], pagination: {...} } }
      const data = response?.data?.data || response?.data || response;
      console.log('Extracted data:', data);

      const enrollmentsData = data?.enrollments || [];
      console.log('Enrollments array:', enrollmentsData);

      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (error) {
      console.error('Error fetching enrollments - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);

      const errorMsg = error.response?.data?.message || error.message || 'Failed to load enrollments';
      enqueueSnackbar(errorMsg, { variant: 'error' });
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedEnrollment || !action) return;

    try {
      await adminService.updateEnrollmentStatus(selectedEnrollment.id, {
        status: action,
        remarks,
      });

      enqueueSnackbar(`Enrollment ${action.toLowerCase()} successfully`, { variant: 'success' });
      setActionDialogOpen(false);
      setSelectedEnrollment(null);
      setAction(null);
      setRemarks('');
      fetchEnrollments();
    } catch (error) {
      console.error('Error updating enrollment:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to update enrollment', { variant: 'error' });
    }
  };

  const openActionDialog = (enrollment, actionType) => {
    setSelectedEnrollment(enrollment);
    setAction(actionType);
    setActionDialogOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      APPLIED: 'warning',
      ENROLLED: 'success',
      COMPLETED: 'info',
      WAITLISTED: 'info',
      REJECTED: 'error',
      WITHDRAWN: 'default',
    };
    return colors[status] || 'default';
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (!enrollment) return false;

    const matchesFilter = filter === 'ALL' || enrollment.enrollmentStatus === filter;
    const candidateName = enrollment.candidate?.fullName || '';
    const courseTitle = enrollment.course?.title || '';
    const courseCode = enrollment.course?.code || '';

    const matchesSearch = searchTerm === '' ||
      candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const statistics = {
    total: enrollments.length,
    applied: enrollments.filter(e => e.enrollmentStatus === 'APPLIED').length,
    enrolled: enrollments.filter(e => e.enrollmentStatus === 'ENROLLED').length,
    completed: enrollments.filter(e => e.enrollmentStatus === 'COMPLETED').length,
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Candidate', 'Email', 'Course', 'Status', 'Payment', 'Enrolled Date'];
    const rows = filteredEnrollments.map(e => [
      e.id,
      e.candidate?.fullName || 'N/A',
      e.candidate?.user?.email || 'N/A',
      e.course?.title || 'N/A',
      e.enrollmentStatus,
      e.paymentStatus || 'PENDING',
      e.enrollmentDate ? format(new Date(e.enrollmentDate), 'yyyy-MM-dd') : ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enrollments_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4" gutterBottom>
            Enrollment Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and manage all course enrollments and applications
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportToCSV}
        >
          Export
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography color="text.secondary" variant="body2">
                    Total Enrollments
                  </Typography>
                  <Typography variant="h4">{statistics.total}</Typography>
                </div>
                <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography color="text.secondary" variant="body2">
                    Pending Applications
                  </Typography>
                  <Typography variant="h4" color="warning.main">{statistics.applied}</Typography>
                </div>
                <CalendarIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography color="text.secondary" variant="body2">
                    Active Enrollments
                  </Typography>
                  <Typography variant="h4" color="success.main">{statistics.enrolled}</Typography>
                </div>
                <PersonIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <div>
                  <Typography color="text.secondary" variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4" color="info.main">{statistics.completed}</Typography>
                </div>
                <SchoolIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by candidate, course, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box display="flex" gap={1} flexWrap="wrap">
                {['ALL', 'APPLIED', 'ENROLLED', 'COMPLETED', 'WAITLISTED', 'REJECTED'].map((status) => (
                  <Chip
                    key={status}
                    label={status === 'ALL' ? 'All' : status}
                    color={filter === status ? 'primary' : 'default'}
                    onClick={() => setFilter(status)}
                    variant={filter === status ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary" align="right">
                Showing {filteredEnrollments.length} of {enrollments.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <SchoolIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No enrollments found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {enrollments.length === 0
                            ? 'There are no enrollments in the system yet.'
                            : 'Try adjusting your search or filter criteria.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((enrollment) => (
                        <TableRow key={enrollment.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {enrollment.candidate?.fullName || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {enrollment.candidate?.user?.email || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {enrollment.course?.title || 'Unknown Course'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {enrollment.course?.code || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {enrollment.enrollmentDate
                              ? format(new Date(enrollment.enrollmentDate), 'MMM dd, yyyy')
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enrollment.enrollmentStatus}
                              color={getStatusColor(enrollment.enrollmentStatus)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enrollment.paymentStatus || 'PENDING'}
                              color={enrollment.paymentStatus === 'PAID' ? 'success' : 'warning'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {enrollment.enrollmentStatus === 'APPLIED' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => openActionDialog(enrollment, 'ENROLLED')}
                                  >
                                    <ApproveIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => openActionDialog(enrollment, 'REJECTED')}
                                  >
                                    <RejectIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredEnrollments.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {action === 'ENROLLED' ? 'Approve Enrollment' : 'Reject Enrollment'}
        </DialogTitle>
        <DialogContent>
          {selectedEnrollment && (
            <Box mt={2}>
              <Alert severity={action === 'ENROLLED' ? 'info' : 'warning'} sx={{ mb: 2 }}>
                {action === 'ENROLLED'
                  ? `Approving ${selectedEnrollment.candidate?.fullName} for ${selectedEnrollment.course?.title}`
                  : `Rejecting ${selectedEnrollment.candidate?.fullName}'s application for ${selectedEnrollment.course?.title}`}
              </Alert>
              <TextField
                label="Remarks (Optional)"
                fullWidth
                multiline
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add notes about this decision..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={action === 'ENROLLED' ? 'success' : 'error'}
            onClick={handleAction}
          >
            Confirm {action === 'ENROLLED' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Enrollments;
