import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Visibility,
  Refresh,
  Groups,
  Delete,
  Archive,
  Publish,
  LockOpen,
  Lock,
} from '@mui/icons-material';
import { cohortService } from '../../api/cohort';
import { format } from 'date-fns';

const Cohorts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCohorts, setTotalCohorts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, cohort: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Show success message from navigation state
  useEffect(() => {
    if (location.state?.success) {
      setSuccess(location.state.success);
      // Clear the state so message doesn't show on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    fetchCohorts();
  }, [page, rowsPerPage, searchQuery, statusFilter, courseFilter]);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        courseId: courseFilter || undefined,
      };
      const response = await cohortService.getCohorts(params);
      setCohorts(response.data.cohorts || []);
      setTotalCohorts(response.data.total || 0);
    } catch (err) {
      console.error('Error fetching cohorts:', err);
      setError(err.response?.data?.message || 'Failed to fetch cohorts');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handlePublish = async (cohort) => {
    try {
      setActionLoading(true);
      await cohortService.publishCohort(cohort.id);
      setSuccess(`Cohort "${cohort.cohortName || cohort.name}" published successfully`);
      fetchCohorts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish cohort');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEnrollment = async (cohort) => {
    try {
      setActionLoading(true);
      await cohortService.openEnrollment(cohort.id);
      setSuccess(`Enrollment opened for "${cohort.cohortName || cohort.name}"`);
      fetchCohorts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to open enrollment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseEnrollment = async (cohort) => {
    try {
      setActionLoading(true);
      await cohortService.closeEnrollment(cohort.id);
      setSuccess(`Enrollment closed for "${cohort.cohortName || cohort.name}"`);
      fetchCohorts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close enrollment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (cohort) => {
    try {
      setActionLoading(true);
      await cohortService.archiveCohort(cohort.id);
      setSuccess(`Cohort "${cohort.cohortName || cohort.name}" archived successfully`);
      fetchCohorts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to archive cohort');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await cohortService.deleteCohort(deleteDialog.cohort.id);
      setSuccess(`Cohort "${deleteDialog.cohort.cohortName || deleteDialog.cohort.name}" deleted successfully`);
      setDeleteDialog({ open: false, cohort: null });
      fetchCohorts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete cohort');
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

  const getStatusLabel = (status) => {
    return status.replace(/_/g, ' ');
  };

  const formatDate = (date) => {
    return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
  };

  const getActionButtons = (cohort) => {
    const buttons = [];
    
    if (cohort.status === 'DRAFT') {
      buttons.push(
        <Tooltip key="publish" title="Publish">
          <IconButton
            size="small"
            onClick={() => handlePublish(cohort)}
            disabled={actionLoading}
          >
            <Publish fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (cohort.status === 'PUBLISHED') {
      buttons.push(
        <Tooltip key="open-enrollment" title="Open Enrollment">
          <IconButton
            size="small"
            onClick={() => handleOpenEnrollment(cohort)}
            disabled={actionLoading}
          >
            <LockOpen fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (cohort.status === 'ENROLLMENT_OPEN') {
      buttons.push(
        <Tooltip key="close-enrollment" title="Close Enrollment">
          <IconButton
            size="small"
            onClick={() => handleCloseEnrollment(cohort)}
            disabled={actionLoading}
          >
            <Lock fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (cohort.status === 'COMPLETED') {
      buttons.push(
        <Tooltip key="archive" title="Archive">
          <IconButton
            size="small"
            onClick={() => handleArchive(cohort)}
            disabled={actionLoading}
          >
            <Archive fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
    
    return buttons;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Groups sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Cohort Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/cohorts/create')}
        >
          Create Cohort
        </Button>
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

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search cohorts..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="PUBLISHED">Published</MenuItem>
              <MenuItem value="ENROLLMENT_OPEN">Enrollment Open</MenuItem>
              <MenuItem value="ENROLLMENT_CLOSED">Enrollment Closed</MenuItem>
              <MenuItem value="IN_TRAINING">In Training</MenuItem>
              <MenuItem value="ASSESSMENT_IN_PROGRESS">Assessment In Progress</MenuItem>
              <MenuItem value="VETTING_IN_PROGRESS">Vetting In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="ARCHIVED">Archived</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={fetchCohorts} disabled={loading}>
            <Refresh />
          </IconButton>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="center">Enrolled</TableCell>
              <TableCell align="center">Capacity</TableCell>
              <TableCell>Lead Trainer</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : cohorts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No cohorts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cohorts.map((cohort) => (
                <TableRow key={cohort.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {cohort.cohortCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{cohort.cohortName || cohort.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {cohort.course?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(cohort.status)}
                      color={getStatusColor(cohort.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(cohort.startDate)}</TableCell>
                  <TableCell>{formatDate(cohort.endDate)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={cohort.enrolledCount || 0}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {cohort.maxCapacity || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {cohort.leadTrainer
                        ? `${cohort.leadTrainer.firstName} ${cohort.leadTrainer.lastName}`
                        : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/admin/cohorts/${cohort.id}`)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {cohort.status === 'DRAFT' && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/admin/cohorts/${cohort.id}/edit`)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {getActionButtons(cohort)}
                      {cohort.status === 'DRAFT' && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteDialog({ open: true, cohort })}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCohorts}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, cohort: null })}
      >
        <DialogTitle>Delete Cohort</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete cohort "{deleteDialog.cohort?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, cohort: null })}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cohorts;
