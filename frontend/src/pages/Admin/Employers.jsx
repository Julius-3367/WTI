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
} from '@mui/material';
import { Search, MoreVert, Edit, Delete, Visibility, Business } from '@mui/icons-material';

const Employers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  // Sample data - replace with real API call
  const employers = [
    { id: 1, company: 'Tech Corp', email: 'contact@techcorp.com', jobs: 12, status: 'Active', joined: '2023-01-15' },
    { id: 2, company: 'Design Studio', email: 'hello@designstudio.com', jobs: 5, status: 'Pending', joined: '2023-02-20' },
    // Add more sample data as needed
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, employer) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployer(employer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredEmployers = employers.filter((employer) =>
    Object.values(employer).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Employers
        </Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Employer
          </Button>
          <TextField
            size="small"
            placeholder="Search employers..."
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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Jobs Posted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employer) => (
                  <TableRow key={employer.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business sx={{ mr: 1, color: 'action.active' }} />
                        {employer.company}
                      </Box>
                    </TableCell>
                    <TableCell>{employer.email}</TableCell>
                    <TableCell>{employer.jobs}</TableCell>
                    <TableCell>
                      <Chip
                        label={employer.status}
                        color={
                          employer.status === 'Active' ? 'success' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{employer.joined}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, employer)}
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
          count={filteredEmployers.length}
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
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View
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

export default Employers;
