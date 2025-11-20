import React from 'react';
import { Grid, Box, Alert, Button } from '@mui/material';
import {
  School as CourseIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CompleteIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../../hooks/useDashboard';
import { trainerDashboard } from '../../api/dashboard';
import {
  DashboardLayout,
  StatCard,
  ActivityTimeline,
  UpcomingEvents,
  CourseProgress,
} from '../../components/dashboard';

/**
 * Trainer Dashboard
 * Auto-refreshes every 30 seconds, shows trainer-specific data
 */
const TrainerDashboard = () => {
  const navigate = useNavigate();

  // Unified dashboard hook with auto-refresh
  const { data, loading, error, lastUpdated, refresh } = useDashboard(
    () => trainerDashboard.getDashboard(),
    {
      refreshInterval: 30000, // 30 seconds
      autoRefresh: true,
    }
  );

  // Extract data with fallbacks
  const stats = data?.stats || {};
  const courses = data?.courses || [];
  const recentActivity = data?.recentActivity || [];
  const upcomingClasses = data?.upcomingClasses || [];
  const profileCompletion = data?.profile?.completionRate || 0;

  return (
    <DashboardLayout
      title="Trainer Dashboard"
      subtitle="Manage your courses, students, and assessments"
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      alerts={
        profileCompletion < 100 && (
          <Alert severity="warning" action={
            <Button color="inherit" size="small" onClick={() => navigate('/trainer/profile')}>
              Complete Now
            </Button>
          }>
            Your profile is {profileCompletion}% complete. Complete your profile to unlock more features!
          </Alert>
        )
      }
    >
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Courses"
            value={stats.activeCourses || 0}
            icon={CourseIcon}
            color="primary"
            trend={stats.courseTrend}
            trendLabel="vs last month"
            loading={loading}
            onClick={() => navigate('/trainer/courses')}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents || 0}
            icon={PeopleIcon}
            color="success"
            trend={stats.studentTrend}
            trendLabel="vs last month"
            loading={loading}
            onClick={() => navigate('/trainer/students')}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Assessments"
            value={stats.pendingAssessments || 0}
            icon={AssignmentIcon}
            color="warning"
            loading={loading}
            onClick={() => navigate('/trainer/assessments')}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate || 0}%`}
            icon={CompleteIcon}
            color="info"
            trend={stats.completionTrend}
            loading={loading}
          />
        </Grid>

        {/* Course Progress */}
        <Grid item xs={12} md={8}>
          <CourseProgress
            courses={courses}
            loading={loading}
            title="My Courses"
            onCourseClick={(course) => navigate(`/trainer/courses/${course.id}`)}
          />
        </Grid>

        {/* Upcoming Classes */}
        <Grid item xs={12} md={4}>
          <UpcomingEvents
            events={upcomingClasses}
            loading={loading}
            title="Upcoming Classes"
            onEventClick={(event) => navigate(`/trainer/courses/${event.courseId}`)}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <ActivityTimeline
            activities={recentActivity}
            loading={loading}
            title="Recent Activity"
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default TrainerDashboard;
