import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  LinearProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Chip,
} from '@mui/material';
import { School as CourseIcon, CheckCircle as CompleteIcon } from '@mui/icons-material';

/**
 * Course Progress Card
 * Shows course progress for candidates/trainers
 */
const CourseProgress = ({ courses = [], loading = false, title = 'Course Progress', onCourseClick }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="rectangular" height={8} sx={{ mt: 1, borderRadius: 1 }} />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} avatar={<CourseIcon />} />
      <CardContent sx={{ pt: 0 }}>
        {courses.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No courses in progress
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {courses.map((course, index) => {
              const progress = course.progress || 0;
              const isComplete = progress >= 100;

              return (
                <ListItem
                  key={course.id || index}
                  sx={{
                    px: 0,
                    cursor: onCourseClick ? 'pointer' : 'default',
                    '&:hover': onCourseClick
                      ? {
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                      }
                      : {},
                  }}
                  onClick={() => onCourseClick && onCourseClick(course)}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>
                          {course.title || course.name}
                        </Typography>
                        {isComplete && <CompleteIcon color="success" fontSize="small" />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(progress, 100)}
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: 1,
                              bgcolor: 'action.hover',
                            }}
                            color={isComplete ? 'success' : 'primary'}
                          />
                          <Typography variant="caption" fontWeight={600}>
                            {progress}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          {course.instructor && (
                            <Typography variant="caption" color="text.secondary">
                              {course.instructor}
                            </Typography>
                          )}
                          {course.status && (
                            <Chip
                              label={course.status}
                              size="small"
                              color={isComplete ? 'success' : 'primary'}
                              sx={{ height: 18 }}
                            />
                          )}
                          {course.nextSession && (
                            <>
                              <Typography variant="caption" color="text.secondary">
                                •
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Next: {new Date(course.nextSession).toLocaleDateString()}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
