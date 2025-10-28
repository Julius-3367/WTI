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
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import { 
  Search, 
  MoreVert, 
  Edit, 
  Delete, 
  Visibility, 
  School, 
  FilterList,
  Add,
  Person,
  Group,
  Event,
  AccessTime,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';

const Training = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  const [view, setView] = useState('list'); // 'list' or 'grid'

  // Sample data - replace with real API call
  const trainings = [
    { 
      id: 1, 
      title: 'Advanced React Development', 
      instructor: 'Jane Smith', 
      category: 'Web Development', 
      students: 42, 
      duration: '8 weeks', 
      status: 'Active', 
      startDate: '2023-04-15',
      endDate: '2023-06-10',
      capacity: 50,
      enrolled: 42,
      description: 'Master advanced React patterns and best practices.'
    },
    { 
      id: 2, 
      title: 'UI/UX Design Fundamentals', 
      instructor: 'John Doe', 
      category: 'Design', 
      students: 28, 
      duration: '6 weeks', 
      status: 'Upcoming', 
      startDate: '2023-05-01',
      endDate: '2023-06-15',
      capacity: 40,
      enrolled: 28,
      description: 'Learn the fundamentals of UI/UX design principles.'
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

  const handleMenuClick = (event, training) => {
    setAnchorEl(event.currentTarget);
    setSelectedTraining(training);
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

  const toggleView = () => {
    setView(view === 'list' ? 'grid' : 'list');
  };

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch = Object.values(training).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesTab = tabValue === 'all' || training.status.toLowerCase() === tabValue.toLowerCase();
    
    return matchesSearch && matchesTab;
  });

  const getStatusChip = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Chip icon={<CheckCircle />} label="Active" color="success" size="small" />;
      case 'upcoming':
        return <Chip icon={<Pending />} label="Upcoming" color="warning" size="small" />;
      case 'completed':
        return <Chip icon={<CheckCircle />} label="Completed" color="primary" size="small" />;
      case 'cancelled':
        return <Chip icon={<Cancel />} label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Training Programs
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            sx={{ mr: 2 }}
          >
            Add Program
          </Button>
          <Button
            variant="outlined"
            startIcon={view === 'list' ? <ViewModule /> : <ViewList />}
            onClick={toggleView}
            sx={{ mr: 2 }}
          >
            {view === 'list' ? 'Grid View' : 'List View'}
          </Button>
          <TextField
            size="small"
            placeholder="Search programs..."
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

      <Paper sx={{ mb: 2, p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Programs" value="all" />
          <Tab 
            label={
              <Badge badgeContent={trainings.filter(t => t.status === 'Active').length} color="success" sx={{ mr: 1 }}>
                Active
              </Badge>
            } 
            value="active" 
          />
          <Tab 
            label={
              <Badge badgeContent={trainings.filter(t => t.status === 'Upcoming').length} color="warning" sx={{ mr: 1 }}>
                Upcoming
              </Badge>
            } 
            value="upcoming" 
          />
          <Tab 
            label={
              <Badge badgeContent={trainings.filter(t => t.status === 'Completed').length} color="primary" sx={{ mr: 1 }}>
                Completed
              </Badge>
            } 
            value="completed" 
          />
        </Tabs>
      </Paper>

      {view === 'list' ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Students</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTrainings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((training) => (
                    <TableRow key={training.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <School sx={{ mr: 1, color: 'action.active' }} />
                          {training.title}
                        </Box>
                      </TableCell>
                      <TableCell>{training.instructor}</TableCell>
                      <TableCell>{training.category}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Group sx={{ mr: 1, color: 'text.secondary' }} />
                          {training.enrolled}/{training.capacity}
                        </Box>
                      </TableCell>
                      <TableCell>{training.duration}</TableCell>
                      <TableCell>{getStatusChip(training.status)}</TableCell>
                      <TableCell>{training.startDate}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, training)}
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
            count={filteredTrainings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredTrainings.map((training) => (
            <Grid item xs={12} sm={6} md={4} key={training.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <School color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {training.title}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, training)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {training.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    <Typography variant="body2">{training.instructor}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    <Typography variant="body2">
                      {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                    <Typography variant="body2">{training.duration}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {training.enrolled} / {training.capacity} enrolled
                      </Typography>
                    </Box>
                    {getStatusChip(training.status)}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Program
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Training;
