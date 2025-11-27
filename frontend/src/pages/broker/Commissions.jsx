import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  PendingActions,
  CheckCircle,
  Refresh
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { brokerAPI } from '../../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function BrokerCommissions() {
  const [commissionsData, setCommissionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await brokerAPI.getCommissions();
      setCommissionsData(response.data?.data || response.data);
    } catch (err) {
      console.error('Failed to fetch commissions:', err);
      setError(err.response?.data?.message || 'Failed to load commissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  const { summary, commissions } = commissionsData || {};

  const stats = [
    {
      title: 'Total Earned',
      value: `KES ${parseFloat(summary?.totalEarned || 0).toLocaleString()}`,
      count: `${summary?.earnedCount || 0} placements`,
      icon: CheckCircle,
      color: '#2e7d32',
      bgColor: '#e8f5e9'
    },
    {
      title: 'Pending Commission',
      value: `KES ${parseFloat(summary?.totalPending || 0).toLocaleString()}`,
      count: `${summary?.pendingCount || 0} placements`,
      icon: PendingActions,
      color: '#ed6c02',
      bgColor: '#fff3e0'
    }
  ];

  const chartData = summary?.byStatus?.map(item => ({
    name: item.status?.replace(/_/g, ' '),
    value: parseFloat(item.amount || 0),
    count: item.count
  })) || [];

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Commission Tracker
        </Typography>
        <IconButton onClick={fetchCommissions} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        backgroundColor: stat.bgColor,
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon sx={{ color: stat.color, fontSize: 32 }} />
                    </Box>
                    <Box flexGrow={1}>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.count}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Commission by Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: KES ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Commission Records
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Job</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commissions && commissions.slice(0, 10).map((commission) => (
                    <TableRow key={commission.id} hover>
                      <TableCell>{commission.candidate?.fullName}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {commission.jobOpening?.jobTitle || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {commission.jobOpening?.employerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={commission.status?.replace(/_/g, ' ')}
                          color={getStatusColor(commission.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          KES {parseFloat(commission.brokerFee || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!commissions || commissions.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No commission records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
