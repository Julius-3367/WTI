import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Search,
  Visibility,
  Refresh
} from '@mui/icons-material';
import { brokerAPI } from '../../api';

export default function BrokerReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    nationalIdPassport: '',
    county: '',
    maritalStatus: '',
    highestEducation: '',
    languages: [],
    relevantSkills: '',
    preferredCountry: '',
    jobTypePreference: '',
    email: '',
    phoneNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReferrals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await brokerAPI.getReferrals({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter,
        search: searchTerm
      });
      setReferrals(response.data?.data || []);
      setTotalCount(response.data?.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
      setError(err.response?.data?.message || 'Failed to load referrals');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const handleSubmitReferral = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await brokerAPI.createReferral(formData);
      setFormOpen(false);
      setFormData({
        fullName: '',
        gender: '',
        dob: '',
        nationalIdPassport: '',
        county: '',
        maritalStatus: '',
        highestEducation: '',
        languages: [],
        relevantSkills: '',
        preferredCountry: '',
        jobTypePreference: '',
        email: '',
        phoneNumber: ''
      });
      fetchReferrals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (referral) => {
    setSelectedReferral(referral);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING_VETTING: 'warning',
      APPROVED: 'success',
      VETTED: 'info',
      ACTIVE: 'success',
      PLACED: 'primary',
      REJECTED: 'error'
    };
    return colors[status] || 'default';
  };

  const filteredReferrals = referrals.filter(ref => 
    !searchTerm || 
    ref.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.nationalIdPassport?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          My Referrals
        </Typography>
        <Box display="flex" gap={2}>
          <IconButton onClick={fetchReferrals} color="primary">
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
          >
            New Referral
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box display="flex" gap={2} mb={3}>
          <TextField
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="PENDING_VETTING">Pending Vetting</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="VETTED">Vetted</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="PLACED">Placed</MenuItem>
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
                    <TableCell>Name</TableCell>
                    <TableCell>ID/Passport</TableCell>
                    <TableCell>Preferred Country</TableCell>
                    <TableCell>Job Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Placements</TableCell>
                    <TableCell>Date Referred</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReferrals.map((referral) => (
                    <TableRow key={referral.id} hover>
                      <TableCell>{referral.fullName}</TableCell>
                      <TableCell>{referral.nationalIdPassport}</TableCell>
                      <TableCell>{referral.preferredCountry || '-'}</TableCell>
                      <TableCell>{referral.jobTypePreference || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={referral.status?.replace(/_/g, ' ')}
                          color={getStatusColor(referral.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{referral.placements?.length || 0}</TableCell>
                      <TableCell>
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(referral)}
                          color="primary"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReferrals.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No referrals found
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

      {/* New Referral Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmitReferral}>
          <DialogTitle>Submit New Referral</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="ID/Passport Number"
                  value={formData.nationalIdPassport}
                  onChange={(e) => setFormData({ ...formData, nationalIdPassport: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="County"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marital Status"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Highest Education"
                  value={formData.highestEducation}
                  onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Country"
                  value={formData.preferredCountry}
                  onChange={(e) => setFormData({ ...formData, preferredCountry: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Type Preference"
                  value={formData.jobTypePreference}
                  onChange={(e) => setFormData({ ...formData, jobTypePreference: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Relevant Skills"
                  value={formData.relevantSkills}
                  onChange={(e) => setFormData({ ...formData, relevantSkills: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Submit Referral'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Referral Details</DialogTitle>
        <DialogContent>
          {selectedReferral && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1">{selectedReferral.fullName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">ID/Passport</Typography>
                  <Typography variant="body1">{selectedReferral.nationalIdPassport}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Gender</Typography>
                  <Typography variant="body1">{selectedReferral.gender || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedReferral.status?.replace(/_/g, ' ')}
                    color={getStatusColor(selectedReferral.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Preferred Country</Typography>
                  <Typography variant="body1">{selectedReferral.preferredCountry || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Job Type Preference</Typography>
                  <Typography variant="body1">{selectedReferral.jobTypePreference || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Skills</Typography>
                  <Typography variant="body1">{selectedReferral.relevantSkills || '-'}</Typography>
                </Grid>
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
