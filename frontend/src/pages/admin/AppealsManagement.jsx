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
  Chip,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Gavel as AppealIcon,
  Pending as PendingIcon,
  ThumbUp as ApprovedIcon,
  ThumbDown as RejectedIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import attendanceAppealService from '../../api/attendanceAppeal';
import ReviewAppealDialog from '../../components/attendance/ReviewAppealDialog';

const AdminAppealsManagement = () => {
  const [appeals, setAppeals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAppeals();
  }, [statusFilter]);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const filters = statusFilter ? { status: statusFilter } : {};
      const response = await attendanceAppealService.getAdminAppeals(filters);
      setAppeals(response?.data?.appeals || []);
      setStatistics(response?.data?.statistics || null);
    } catch (error) {
      console.error('Error fetching appeals:', error);
      enqueueSnackbar('Failed to load appeals', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = (appeal) => {
    setSelectedAppeal(appeal);
    setReviewDialogOpen(true);
  };

  const handleReviewComplete = () => {
    fetchAppeals();
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <PendingIcon fontSize="small" />,
      APPROVED: <ApprovedIcon fontSize="small" />,
      REJECTED: <RejectedIcon fontSize="small" />,
    };
    return icons[status];
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Attendance Appeals Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and manage all attendance appeal requests
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchAppeals}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AppealIcon color="primary" />
                  <Typography color="text.secondary" variant="body2">
                    Total Appeals
                  </Typography>
                </Box>
                <Typography variant="h4">{statistics.total || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <PendingIcon color="warning" />
                  <Typography color="text.secondary" variant="body2">
                    Pending
                  </Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {statistics.pending || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ApprovedIcon color="success" />
                  <Typography color="text.secondary" variant="body2">
                    Approved
                  </Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {statistics.approved || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <RejectedIcon color="error" />
                  <Typography color="text.secondary" variant="body2">
                    Rejected
                  </Typography>
                </Box>
                <Typography variant="h4" color="error.main">
                  {statistics.rejected || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status Filter"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Appeals Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Original Status</TableCell>
                <TableCell>Requested</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Reviewed By</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : appeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Alert severity="info">
                      No appeals found{statusFilter ? ' with the selected filter' : ''}.
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                appeals.map((appeal) => (
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
                      <Typography variant="caption" color="text.secondary">
                        {appeal.attendanceRecord?.course?.code}
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
                      {appeal.requestedStatus ? (
                        <Chip
                          label={appeal.requestedStatus}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Not specified
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appeal.status}
                        size="small"
                        color={getStatusColor(appeal.status)}
                        icon={getStatusIcon(appeal.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(appeal.createdAt), 'MMM dd, hh:mm a')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {appeal.reviewer ? (
                        <Typography variant="caption">
                          {appeal.reviewer.firstName} {appeal.reviewer.lastName}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View/Override">
                          <Button
                            size="small"
                            variant={appeal.status === 'PENDING' ? 'contained' : 'outlined'}
                            onClick={() => handleOverride(appeal)}
                          >
                            {appeal.status === 'PENDING' ? 'Review' : 'Override'}
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Review/Override Dialog */}
      <ReviewAppealDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        appeal={selectedAppeal}
        onReviewComplete={handleReviewComplete}
        isAdmin={true}
      />
    </Box>
  );
};

export default AdminAppealsManagement;
