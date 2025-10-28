import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  FileDownload,
  Print,
  Share,
  Refresh,
  BarChart,
  PieChart,
  ShowChart,
  DateRange,
  Description,
  CloudDownload,
} from '@mui/icons-material';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [reportType, setReportType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [tabValue, setTabValue] = useState('overview');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sample data for charts
  const jobData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Jobs Posted',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const userData = {
    labels: ['Candidates', 'Employers', 'Admins'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1200, 1900, 3000, 2500, 2000, 3000],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Sample reports data
  const reports = [
    {
      id: 1,
      title: 'Monthly Jobs Report',
      type: 'jobs',
      date: '2023-06-30',
      status: 'generated',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'User Registration Report',
      type: 'users',
      date: '2023-06-28',
      status: 'pending',
      format: 'CSV',
      size: '1.2 MB',
    },
    {
      id: 3,
      title: 'Revenue Report Q2 2023',
      type: 'revenue',
      date: '2023-06-25',
      status: 'failed',
      format: 'PDF',
      size: 'N/A',
    },
    // Add more sample reports as needed
  ];

  const handleMenuClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredReports = reports.filter((report) =>
    Object.values(report).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusChip = (status) => {
    switch (status.toLowerCase()) {
      case 'generated':
        return <Chip label="Generated" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Reports & Analytics
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownload />}
            sx={{ mr: 2 }}
          >
            Export Report
          </Button>
          <TextField
            size="small"
            placeholder="Search reports..."
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

      <Paper sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" value="overview" icon={<BarChart />} iconPosition="start" />
          <Tab label="All Reports" value="reports" icon={<Description />} iconPosition="start" />
          <Tab label="Scheduled" value="scheduled" icon={<DateRange />} iconPosition="start" />
        </Tabs>
      </Paper>

      {tabValue === 'overview' && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader 
                  title="Job Postings Trend" 
                  action={
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Date Range</InputLabel>
                      <Select
                        value={dateRange}
                        label="Date Range"
                        onChange={(e) => setDateRange(e.target.value)}
                      >
                        <MenuItem value="thisWeek">This Week</MenuItem>
                        <MenuItem value="thisMonth">This Month</MenuItem>
                        <MenuItem value="thisYear">This Year</MenuItem>
                      </Select>
                    </FormControl>
                  }
                />
                <CardContent sx={{ height: 300, pt: 0 }}>
                  <Bar 
                    data={jobData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="User Distribution" />
                <CardContent sx={{ height: 300, pt: 0 }}>
                  <Pie 
                    data={userData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Revenue Overview" 
                  action={
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Report Type</InputLabel>
                      <Select
                        value={reportType}
                        label="Report Type"
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <MenuItem value="all">All Revenue</MenuItem>
                        <MenuItem value="subscriptions">Subscriptions</MenuItem>
                        <MenuItem value="premium">Premium Services</MenuItem>
                      </Select>
                    </FormControl>
                  }
                />
                <CardContent sx={{ height: 300, pt: 0 }}>
                  <Line 
                    data={revenueData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {tabValue === 'reports' && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((report) => (
                    <TableRow key={report.id} hover>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={report.type} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{getStatusChip(report.status)}</TableCell>
                      <TableCell>{report.format}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, report)}
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
            count={filteredReports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {tabValue === 'scheduled' && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <DateRange sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Scheduled Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Schedule reports to be generated and delivered automatically.
          </Typography>
          <Button variant="contained" color="primary">
            Schedule New Report
          </Button>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <CloudDownload fontSize="small" sx={{ mr: 1 }} /> Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Print fontSize="small" sx={{ mr: 1 }} /> Print
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share fontSize="small" sx={{ mr: 1 }} /> Share
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Reports;
