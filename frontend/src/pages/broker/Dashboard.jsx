import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assignment,
  AttachMoney,
  PendingActions,
  CheckCircle,
  ArrowForward,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { brokerAPI } from '../../api';

export default function BrokerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await brokerAPI.getDashboard();
      setDashboardData(response.data?.data || response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchDashboard}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const { broker, stats, recentCandidates, recentPlacements, monthlyStats } = dashboardData || {};

  const statCards = [
    {
      title: 'Total Referrals',
      value: stats?.totalReferrals || 0,
      icon: People,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      action: () => navigate('/broker/referrals')
    },
    {
      title: 'Active Placements',
      value: stats?.activePlacements || 0,
      icon: Assignment,
      color: '#ed6c02',
      bgColor: '#fff3e0',
      action: () => navigate('/broker/placements')
    },
    {
      title: 'Completed Placements',
      value: stats?.completedPlacements || 0,
      icon: CheckCircle,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      action: () => navigate('/broker/placements')
    },
    {
      title: 'Total Earned',
      value: `KES ${parseFloat(stats?.totalCommissionEarned || 0).toLocaleString()}`,
      icon: AttachMoney,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
      action: () => navigate('/broker/commissions')
    },
    {
      title: 'Pending Commission',
      value: `KES ${parseFloat(stats?.pendingCommission || 0).toLocaleString()}`,
      icon: PendingActions,
      color: '#d32f2f',
      bgColor: '#ffebee',
      action: () => navigate('/broker/commissions')
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Broker Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {broker?.name} ({broker?.brokerCode})
          </Typography>
        </Box>
        <IconButton onClick={fetchDashboard} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
                onClick={stat.action}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box
                      sx={{
                        backgroundColor: stat.bgColor,
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon sx={{ color: stat.color, fontSize: 28 }} />
                    </Box>
                    <ArrowForward sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Referrals (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="referrals" fill="#1976d2" name="Referrals" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Commission Breakdown
            </Typography>
            <Box mt={3}>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Commission Rate
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {broker?.commissionType === 'Percentage' 
                    ? `${broker?.commissionAmount}%` 
                    : `KES ${broker?.commissionAmount}`}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Payment Terms
                </Typography>
                <Typography variant="body1">
                  {broker?.paymentTerms || 'Net 30'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recent Referrals
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/broker/referrals')}
                endIcon={<ArrowForward />}
              >
                View All
              </Button>
            </Box>
            <List>
              {recentCandidates && recentCandidates.length > 0 ? (
                recentCandidates.map((candidate, index) => (
                  <div key={candidate.id}>
                    <ListItem>
                      <ListItemText
                        primary={candidate.fullName}
                        secondary={
                          <Box component="span" display="flex" alignItems="center" gap={1}>
                            <Typography variant="caption" component="span">
                              {candidate.preferredCountry || 'N/A'}
                            </Typography>
                            <Typography variant="caption" component="span" color="text.secondary">
                              • {new Date(candidate.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          label={candidate.status?.replace(/_/g, ' ')} 
                          size="small"
                          color={candidate.status === 'ACTIVE' ? 'success' : 'default'}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < recentCandidates.length - 1 && <Divider />}
                  </div>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    secondary="No recent referrals"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recent Placements
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/broker/placements')}
                endIcon={<ArrowForward />}
              >
                View All
              </Button>
            </Box>
            <List>
              {recentPlacements && recentPlacements.length > 0 ? (
                recentPlacements.map((placement, index) => (
                  <div key={placement.id}>
                    <ListItem>
                      <ListItemText
                        primary={placement.candidate?.fullName}
                        secondary={
                          <Box component="span">
                            <Typography variant="caption" display="block">
                              {placement.jobOpening?.jobTitle} - {placement.jobOpening?.employerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {placement.jobOpening?.location}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          label={placement.placementStatus?.replace(/_/g, ' ')} 
                          size="small"
                          color={placement.placementStatus === 'COMPLETED' ? 'success' : 'warning'}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < recentPlacements.length - 1 && <Divider />}
                  </div>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    secondary="No recent placements"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
