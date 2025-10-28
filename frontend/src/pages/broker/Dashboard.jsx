import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  CircularProgress,
  Alert,
  Container,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  CalculatorIcon,
  BanknotesIcon,
  CalendarIcon,
  QrCodeIcon,
  LinkIcon,
  ShareIcon,
  UserPlusIcon,
  AcademicCapIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolid,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import useAuthStore from '../../store/authStore';

// Custom tab panel component
const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`broker-tabpanel-${index}`}
    aria-labelledby={`broker-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </Box>
);

const BrokerDashboard = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Mock broker data
  const [brokerData, setBrokerData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setBrokerData({
        stats: [
          {
            title: 'Active Clients',
            value: '156',
            change: '+12',
            trend: 'up',
            icon: UserGroupIcon,
            color: theme.palette.primary.main,
          },
          {
            title: 'Total Revenue',
            value: '$45,280',
            change: '+18%',
            trend: 'up',
            icon: CurrencyDollarIcon,
            color: theme.palette.success.main,
          },
          {
            title: 'Services Provided',
            value: '89',
            change: '+7',
            trend: 'up',
            icon: UserPlusIcon,
            color: theme.palette.info.main,
          },
          {
            title: 'Success Rate',
            value: '92%',
            change: '+3%',
            trend: 'up',
            icon: ChartBarIcon,
            color: theme.palette.secondary.main,
          },
        ],
        clients: [
          {
            id: 1,
            name: 'Ahmed Al-Rashid',
            email: 'ahmed.rashid@email.com',
            phone: '+971-50-123-4567',
            status: 'Active',
            joinDate: '2024-01-15',
            serviceType: 'Labor Supply',
            totalSpent: '$8,500',
            location: 'Dubai',
          },
          {
            id: 2,
            name: 'Fatima Hassan',
            email: 'fatima.hassan@email.com',
            phone: '+971-50-234-5678',
            status: 'Pending',
            joinDate: '2024-01-20',
            serviceType: 'Visa Processing',
            totalSpent: '$2,200',
            location: 'Abu Dhabi',
          },
          {
            id: 3,
            name: 'Emirates Construction LLC',
            email: 'contracts@emiratesconstruction.ae',
            phone: '+971-4-567-8901',
            status: 'Active',
            joinDate: '2024-01-10',
            serviceType: 'Workforce Solutions',
            totalSpent: '$25,600',
            location: 'Dubai',
          },
          {
            id: 4,
            name: 'Sarah Al-Mahmoud',
            email: 'sarah.mahmoud@email.com',
            phone: '+971-50-345-6789',
            status: 'Completed',
            joinDate: '2024-01-08',
            serviceType: 'Document Processing',
            totalSpent: '$1,800',
            location: 'Sharjah',
          },
          {
            id: 5,
            name: 'Mohammad Khalil',
            email: 'mohammad.khalil@email.com',
            phone: '+971-50-456-7890',
            status: 'Active',
            joinDate: '2024-01-22',
            serviceType: 'Training Coordination',
            totalSpent: '$4,200',
            location: 'Dubai',
          },
        ],
        services: [
          {
            id: 1,
            name: 'Labor Supply Services',
            description: 'Connecting clients with skilled workers',
            activeContracts: 45,
            revenue: '$28,500',
            successRate: 94,
          },
          {
            id: 2,
            name: 'Visa Processing',
            description: 'Complete visa and documentation services',
            activeContracts: 23,
            revenue: '$12,200',
            successRate: 88,
          },
          {
            id: 3,
            name: 'Training Coordination',
            description: 'Organizing specialized training programs',
            activeContracts: 15,
            revenue: '$8,600',
            successRate: 96,
          },
          {
            id: 4,
            name: 'Compliance Support',
            description: 'Ensuring regulatory compliance',
            activeContracts: 31,
            revenue: '$15,400',
            successRate: 91,
          },
        ],
        recentTransactions: [
          {
            id: 1,
            client: 'Emirates Construction LLC',
            service: 'Workforce Solutions',
            amount: '$3,200',
            date: '2024-01-25',
            status: 'Completed',
          },
          {
            id: 2,
            client: 'Ahmed Al-Rashid',
            service: 'Labor Supply',
            amount: '$1,500',
            date: '2024-01-24',
            status: 'Pending',
          },
          {
            id: 3,
            client: 'Mohammad Khalil',
            service: 'Training Coordination',
            amount: '$800',
            date: '2024-01-23',
            status: 'Completed',
          },
          {
            id: 4,
            client: 'Fatima Hassan',
            service: 'Visa Processing',
            amount: '$600',
            date: '2024-01-22',
            status: 'In Progress',
          },
        ],
        revenueData: [
          { month: 'Jul', revenue: 28500, services: 67 },
          { month: 'Aug', revenue: 32400, services: 74 },
          { month: 'Sep', revenue: 29800, services: 69 },
          { month: 'Oct', revenue: 35600, services: 82 },
          { month: 'Nov', revenue: 38200, services: 89 },
          { month: 'Dec', revenue: 45280, services: 95 },
        ],
        serviceDistribution: [
          {
            name: 'Labor Supply',
            value: 45,
            color: theme.palette.primary.main,
          },
          {
            name: 'Visa Processing',
            value: 23,
            color: theme.palette.info.main,
          },
          { name: 'Training', value: 15, color: theme.palette.warning.main },
          { name: 'Compliance', value: 31, color: theme.palette.success.main },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [theme]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return theme.palette.success;
      case 'Pending':
        return theme.palette.warning;
      case 'Completed':
        return theme.palette.primary;
      case 'In Progress':
        return theme.palette.info;
      default:
        return theme.palette.grey;
    }
  };

  const handleServiceView = service => {
    setSelectedService(service);
    setServiceDialogOpen(true);
  };

  const filteredClients =
    brokerData?.clients.filter(
      client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={64} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Welcome Banner */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Grid container alignItems="center" spacing={3}>
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '2rem',
                bgcolor: 'rgba(255,255,255,0.2)',
              }}
            >
              {user?.firstName?.charAt(0) || 'B'}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Welcome, {user?.firstName || 'Broker'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Manage your clients and grow your brokerage business
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<UserPlusIcon style={{ width: 20, height: 20 }} />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }}
              >
                Add New Client
              </Button>
              <Button
                variant="outlined"
                startIcon={<ChartBarIcon style={{ width: 20, height: 20 }} />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                View Analytics
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {brokerData.stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    <stat.icon style={{ width: 24, height: 24 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    size="small"
                    label={stat.change}
                    sx={{
                      backgroundColor: theme.palette.success.light,
                      color: theme.palette.success.dark,
                      fontWeight: 600,
                    }}
                  />
                  <ArrowTrendingUpIcon
                    style={{
                      width: 16,
                      height: 16,
                      color: theme.palette.success.main,
                      marginLeft: 8,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Clients" />
          <Tab label="Services" />
          <Tab label="Transactions" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Charts Section */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                {/* Revenue Chart */}
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Revenue & Service Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={brokerData.revenueData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme.palette.grey[200]}
                        />
                        <XAxis
                          dataKey="month"
                          stroke={theme.palette.text.secondary}
                        />
                        <YAxis stroke={theme.palette.text.secondary} />
                        <RechartsTooltip />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke={theme.palette.primary.main}
                          fill={theme.palette.primary.main}
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Service Distribution */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Service Distribution
                    </Typography>
                    <Grid container spacing={2}>
                      {brokerData.serviceDistribution.map((service, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                backgroundColor: service.color,
                                mr: 2,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {service.name}
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {service.value} contracts
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Recent Transactions */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Recent Transactions
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {brokerData.recentTransactions
                        .slice(0, 4)
                        .map((transaction, index) => (
                          <React.Fragment key={transaction.id}>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    backgroundColor: getStatusColor(
                                      transaction.status
                                    ).light,
                                    color: getStatusColor(transaction.status)
                                      .main,
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  <CurrencyDollarIcon
                                    style={{ width: 16, height: 16 }}
                                  />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {transaction.client}
                                  </Typography>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {transaction.service} • {transaction.amount}
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      sx={{
                                        color: getStatusColor(
                                          transaction.status
                                        ).main,
                                        fontWeight: 600,
                                        ml: 1,
                                      }}
                                    >
                                      • {transaction.status}
                                    </Typography>
                                  </Typography>
                                }
                              />
                            </ListItem>
                            {index <
                              brokerData.recentTransactions.length - 1 && (
                              <Divider />
                            )}
                          </React.Fragment>
                        ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      This Month Performance
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">
                            Revenue Target
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            89%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={89}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              bgcolor: theme.palette.success.main,
                            },
                          }}
                        />
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">
                            Client Satisfaction
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            94%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={94}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                              bgcolor: theme.palette.primary.main,
                            },
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          pt: 2,
                        }}
                      >
                        <Typography variant="body2">New Clients</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          12
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">
                          Active Contracts
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          114
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Clients Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MagnifyingGlassIcon
                          style={{ width: 20, height: 20 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
                  >
                    Add Client
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Service Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Spent</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(client => (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{ mr: 2, bgcolor: theme.palette.primary.light }}
                          >
                            {client.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {client.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {client.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {client.serviceType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {client.location}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={client.status}
                          sx={{
                            bgcolor: getStatusColor(client.status).light,
                            color: getStatusColor(client.status).dark,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {client.joinDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.success.main,
                          }}
                        >
                          {client.totalSpent}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <EyeIcon style={{ width: 18, height: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredClients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={event => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </TabPanel>

        {/* Services Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {brokerData.services.map(service => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {service.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {service.description}
                    </Typography>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">
                          Active Contracts
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {service.activeContracts}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">Revenue</Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.success.main,
                          }}
                        >
                          {service.revenue}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">Success Rate</Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {service.successRate}%
                        </Typography>
                      </Box>
                    </Stack>
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleServiceView(service)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Transactions Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="body1" color="text.secondary">
            Detailed transaction history and financial reporting interface.
          </Typography>
        </TabPanel>
      </Paper>

      {/* Service Details Dialog */}
      <Dialog
        open={serviceDialogOpen}
        onClose={() => setServiceDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedService && (
          <>
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {selectedService.name}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedService.description}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {selectedService.activeContracts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Contracts
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.success.main,
                      }}
                    >
                      {selectedService.revenue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {selectedService.successRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setServiceDialogOpen(false)}>Close</Button>
              <Button variant="contained">Manage Service</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default BrokerDashboard;
