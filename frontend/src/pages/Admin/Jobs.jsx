import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { Search, MoreVert, Edit, Delete, Visibility, Work, FilterList } from '@mui/icons-material';

const Jobs = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tabValue, setTabValue] = useState('all');

  // Sample data - replace with real API call
  const jobs = [
    { 
      id: 1, 
      title: 'Senior Frontend Developer', 
      company: 'Tech Corp', 
      type: 'Full-time', 
      location: 'Remote', 
      status: 'Active', 
      date: '2023-03-15',
      applications: 24
    },
    { 
      id: 2, 
      title: 'UX Designer', 
      company: 'Design Studio', 
      type: 'Contract', 
      location: 'Nairobi', 
      status: 'Draft', 
      date: '2023-03-10',
      applications: 5
    },
    // Add more sample data as needed
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = Object.values(job).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesTab = tabValue === 'all' || job.status.toLowerCase() === tabValue;
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'draft':
        return 'default';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Job Listings
        </Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Post New Job
          </Button>
          <TextField
            size="small"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Jobs" value="all" />
          <Tab 
            label={
              <Badge badgeContent={jobs.filter(j => j.status === 'Active').length} color="primary">
                Active
              </Badge>
            } 
            value="active" 
          />
          <Tab 
            label={
              <Badge badgeContent={jobs.filter(j => j.status === 'Draft').length} color="default">
                Drafts
              </Badge>
            } 
            value="draft" 
          />
          <Tab 
            label={
              <Badge badgeContent={jobs.filter(j => j.status === 'Closed').length} color="error">
                Closed
              </Badge>
            } 
            value="closed" 
          />
        </Tabs>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Applications</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Posted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredJobs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Work sx={{ mr: 1, color: 'action.active' }} />
                        {job.title}
                      </Box>
                    </TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      <Chip 
                        label={job.applications} 
                        size="small"
                        color={job.applications > 10 ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, job)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredJobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Jobs;
