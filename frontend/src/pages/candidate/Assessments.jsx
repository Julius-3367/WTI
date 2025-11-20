import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle as PassIcon,
  Cancel as FailIcon,
  HourglassEmpty as IncompleteIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import candidateService from '../../api/candidate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await candidateService.getMyCourses();
      setCourses(response || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const courseId = selectedCourse !== 'all' ? selectedCourse : undefined;
      const response = await candidateService.getAssessments(courseId);
      setAssessments(response.assessments || []);
      setStatistics(response.statistics || {});
    } catch (error) {
      console.error('Error fetching assessments:', error);
      enqueueSnackbar('Failed to load assessments', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result) => {
    const colors = {
      PASS: 'success',
      FAIL: 'error',
      INCOMPLETE: 'warning',
    };
    return colors[result] || 'default';
  };

  const getResultIcon = (result) => {
    const icons = {
      PASS: <PassIcon />,
      FAIL: <FailIcon />,
      INCOMPLETE: <IncompleteIcon />,
    };
    return icons[result];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  const prepareProgressChartData = () => {
    const sortedAssessments = [...assessments]
      .filter(a => a.score !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10); // Last 10 assessments

    return {
      labels: sortedAssessments.map(a => format(new Date(a.date), 'MMM dd')),
      datasets: [
        {
          label: 'Assessment Scores',
          data: sortedAssessments.map(a => a.score),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
      ],
    };
  };

  const prepareResultsChartData = () => {
    return {
      labels: ['Pass', 'Fail', 'Incomplete'],
      datasets: [
        {
          data: [
            statistics?.passed || 0,
            statistics?.failed || 0,
            statistics?.incomplete || 0,
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareTypeChartData = () => {
    const types = {};
    assessments.forEach(a => {
      types[a.assessmentType] = (types[a.assessmentType] || 0) + 1;
    });

    return {
      labels: Object.keys(types),
      datasets: [
        {
          label: 'Assessments by Type',
          data: Object.values(types),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Assessments & Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your assessment scores and academic progress
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            label="Filter by Course"
          >
            <MenuItem value="all">All Courses</MenuItem>
            {courses.map((enrollment) => (
              <MenuItem key={enrollment.course.id} value={enrollment.course.id}>
                {enrollment.course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AssessmentIcon color="action" />
                  <Typography color="text.secondary" variant="body2">
                    Total Assessments
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
                  <PassIcon color="success" />
                  <Typography color="text.secondary" variant="body2">
                    Passed
                  </Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {statistics.passed || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <StarIcon color="primary" />
                  <Typography color="text.secondary" variant="body2">
                    Average Score
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary.main">
                  {statistics.averageScore || 0}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrophyIcon color="warning" />
                  <Typography color="text.secondary" variant="body2">
                    Pass Rate
                  </Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {statistics.passRate || 0}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(statistics.passRate || 0)}
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  color="warning"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Performance Alert */}
      {statistics && parseFloat(statistics.passRate) < 60 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your pass rate is below 60%. Consider reviewing your study methods and seeking additional support.
        </Alert>
      )}
      {statistics && parseFloat(statistics.passRate) >= 80 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Excellent performance! Keep up the great work!
        </Alert>
      )}

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Score Progress
            </Typography>
            {assessments.filter(a => a.score !== null).length > 0 ? (
              <Box height={280}>
                <Line data={prepareProgressChartData()} options={chartOptions} />
              </Box>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height={280}>
                <Typography color="text.secondary">
                  No score data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Results Distribution
            </Typography>
            {statistics && statistics.total > 0 ? (
              <Box height={280}>
                <Doughnut data={prepareResultsChartData()} options={chartOptions} />
              </Box>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height={280}>
                <Typography color="text.secondary">
                  No results data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Assessment Type Distribution */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Assessment Types
            </Typography>
            {assessments.length > 0 ? (
              <Box height={280}>
                <Bar data={prepareTypeChartData()} options={chartOptions} />
              </Box>
            ) : (
              <Box display="flex" alignments="center" justifyContent="center" height={280}>
                <Typography color="text.secondary">
                  No assessment data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Assessment Records Table */}
      <Paper>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Assessment History
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Assessment Type</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box py={4}>
                      <AssessmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No assessments found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your assessment results will appear here once you complete evaluations
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                assessments.map((assessment) => (
                  <TableRow key={assessment.id} hover>
                    <TableCell>
                      {assessment.date
                        ? format(new Date(assessment.date), 'MMM dd, yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{assessment.course?.title || 'N/A'}</TableCell>
                    <TableCell>{assessment.assessmentType}</TableCell>
                    <TableCell>
                      {assessment.score !== null ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="h6"
                            color={getScoreColor(assessment.score)}
                          >
                            {assessment.score}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={assessment.score}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {assessment.resultCategory ? (
                        <Chip
                          label={assessment.resultCategory}
                          color={getResultColor(assessment.resultCategory)}
                          size="small"
                          icon={getResultIcon(assessment.resultCategory)}
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {assessment.trainerComments || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Assessments;
