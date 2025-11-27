import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
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
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Search,
  Visibility,
  Refresh
} from '@mui/icons-material';
import { brokerAPI } from '../../api';

const placementStatuses = [
  'INITIATED',
  'INTERVIEW_SCHEDULED',
  'OFFER_LETTER_SENT',
  'VISA_PROCESSING',
  'TRAVEL_READY',
  'COMPLETED'
];

export default function BrokerPlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  const fetchPlacements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await brokerAPI.getPlacements({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter
      });
      setPlacements(response.data?.data || []);
      setTotalCount(response.data?.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch placements:', err);
      setError(err.response?.data?.message || 'Failed to load placements');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  const getStatusColor = (status) => {
    const colors = {
      INITIATED: 'info',
      INTERVIEW_SCHEDULED: 'warning',
      OFFER_LETTER_SENT: 'primary',
      VISA_PROCESSING: 'secondary',
      TRAVEL_READY: 'success',
      COMPLETED: 'success',
      CANCELLED: 'error'
    };
    return colors[status] || 'default';
  };

  const getActiveStep = (status) => {
    return placementStatuses.indexOf(status);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Placements
        </Typography>
        <IconButton onClick={fetchPlacements} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box display="flex" gap={2} mb={3}>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Status</MenuItem>
            {placementStatuses.map(status => (
              <MenuItem key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </MenuItem>
            ))}
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Broker Fee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {placements.map((placement) => (
                    <TableRow key={placement.id} hover>
                      <TableCell>{placement.candidate?.fullName}</TableCell>
                      <TableCell>{placement.jobOpening?.jobTitle || placement.jobRoleOffered || '-'}</TableCell>
                      <TableCell>{placement.jobOpening?.employerName || placement.employerName || '-'}</TableCell>
                      <TableCell>{placement.jobOpening?.location || placement.country || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={placement.placementStatus?.replace(/_/g, ' ')}
                          color={getStatusColor(placement.placementStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        ${parseFloat(placement.brokerFee || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(placement.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedPlacement(placement);
                            setDetailsOpen(true);
                          }}
                          color="primary"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {placements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No placements found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalCount}
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
      </Paper>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Placement Details</DialogTitle>
        <DialogContent>
          {selectedPlacement && (
            <Box>
              <Stepper activeStep={getActiveStep(selectedPlacement.placementStatus)} sx={{ mb: 4, mt: 2 }}>
                {placementStatuses.map((status) => (
                  <Step key={status}>
                    <StepLabel>{status.replace(/_/g, ' ')}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Candidate</Typography>
                  <Typography variant="body1">{selectedPlacement.candidate?.fullName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Job Title</Typography>
                  <Typography variant="body1">
                    {selectedPlacement.jobOpening?.jobTitle || selectedPlacement.jobRoleOffered || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Company</Typography>
                  <Typography variant="body1">
                    {selectedPlacement.jobOpening?.employerName || selectedPlacement.employerName || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body1">
                    {selectedPlacement.jobOpening?.location || selectedPlacement.country || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Broker Fee</Typography>
                  <Typography variant="h6" color="primary">
                    KES {parseFloat(selectedPlacement.brokerFee || 0).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedPlacement.placementStatus?.replace(/_/g, ' ')}
                    color={getStatusColor(selectedPlacement.placementStatus)}
                  />
                </Grid>
                {selectedPlacement.interviewDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Interview Date</Typography>
                    <Typography variant="body1">
                      {new Date(selectedPlacement.interviewDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
                {selectedPlacement.placementCompletedDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Completion Date</Typography>
                    <Typography variant="body1">
                      {new Date(selectedPlacement.placementCompletedDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
