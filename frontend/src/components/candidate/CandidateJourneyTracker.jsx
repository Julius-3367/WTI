import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  styled,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  PlayCircle,
  PersonAdd,
  School,
  Assignment,
  VerifiedUser,
  Work,
  EmojiEvents,
  Info,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Journey stages configuration
const JOURNEY_STAGES = [
  {
    id: 'registration',
    label: 'Registration',
    icon: PersonAdd,
    description: 'Complete profile and document submission',
    color: '#2196F3', // Blue
    tasks: [
      'Personal information',
      'Contact details',
      'Upload documents',
      'Email verification',
    ],
  },
  {
    id: 'training',
    label: 'Training',
    icon: School,
    description: 'Enroll and complete required courses',
    color: '#9C27B0', // Purple
    tasks: [
      'Course enrollment',
      'Attend sessions',
      'Complete modules',
      'Obtain certifications',
    ],
  },
  {
    id: 'assessment',
    label: 'Assessment',
    icon: Assignment,
    description: 'Skills and competency evaluation',
    color: '#FF9800', // Orange
    tasks: [
      'Skills test',
      'Language proficiency',
      'Practical assessment',
      'Results review',
    ],
  },
  {
    id: 'vetting',
    label: 'Vetting',
    icon: VerifiedUser,
    description: 'Background checks and verification',
    color: '#F44336', // Red
    tasks: [
      'Document verification',
      'Background check',
      'Reference check',
      'Compliance review',
    ],
  },
  {
    id: 'job_matching',
    label: 'Job Matching',
    icon: Work,
    description: 'Connect with suitable employment opportunities',
    color: '#00BCD4', // Cyan
    tasks: [
      'Profile matching',
      'Employer interviews',
      'Offer negotiation',
      'Contract preparation',
    ],
  },
  {
    id: 'placed',
    label: 'Placed',
    icon: EmojiEvents,
    description: 'Successfully employed and deployed',
    color: '#4CAF50', // Green
    tasks: [
      'Contract signed',
      'Pre-departure orientation',
      'Travel arrangements',
      'Employment commenced',
    ],
  },
];

// Status badge configuration
const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    color: 'success',
    icon: CheckCircle,
  },
  in_progress: {
    label: 'In Progress',
    color: 'primary',
    icon: PlayCircle,
  },
  pending: {
    label: 'Pending',
    color: 'default',
    icon: RadioButtonUnchecked,
  },
  blocked: {
    label: 'Blocked',
    color: 'error',
    icon: Info,
  },
};

// Styled components
const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  '&.MuiStepConnector-root': {
    marginLeft: 20,
  },
  '& .MuiStepConnector-line': {
    borderLeftWidth: 3,
    borderColor: theme.palette.divider,
    minHeight: 30,
  },
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: theme.palette.success.main,
  },
}));

const StageIconWrapper = styled(Box)(({ theme, status, stageColor }) => {
  let bgcolor = theme.palette.grey[300];
  let color = theme.palette.grey[600];

  if (status === 'completed') {
    bgcolor = theme.palette.success.main;
    color = '#fff';
  } else if (status === 'in_progress') {
    bgcolor = stageColor || theme.palette.primary.main;
    color = '#fff';
  }

  return {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bgcolor,
    color: color,
    border: `3px solid ${alpha(bgcolor, 0.3)}`,
    boxShadow: `0 4px 8px ${alpha(bgcolor, 0.3)}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: `0 6px 12px ${alpha(bgcolor, 0.4)}`,
    },
  };
});

const TimelineCard = styled(Card)(({ theme, isActive, isCompleted }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `2px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: isCompleted
    ? alpha(theme.palette.success.main, 0.05)
    : isActive
      ? alpha(theme.palette.primary.main, 0.05)
      : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: isActive ? theme.palette.primary.dark : theme.palette.primary.light,
  },
}));

/**
 * CandidateJourneyTracker - Visual progress tracker for candidate journey stages
 * 
 * @param {Object} props
 * @param {Object} props.candidateData - Candidate data with journey information
 * @param {Function} props.onStageClick - Callback when stage is clicked
 * @param {Boolean} props.showTimeline - Whether to show timeline view (default: true)
 * @param {Boolean} props.showTasks - Whether to show task lists (default: true)
 */
const CandidateJourneyTracker = ({
  candidateData = {},
  onStageClick,
  showTimeline = true,
  showTasks = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedStage, setExpandedStage] = useState(null);

  // Extract journey data from candidateData
  const currentStageId = candidateData.currentStage || 'registration';
  const completedStages = candidateData.completedStages || [];
  const stageDates = candidateData.stageDates || {};
  const stageProgress = candidateData.stageProgress || {};

  // Calculate overall progress percentage
  const calculateProgress = () => {
    const currentStageIndex = JOURNEY_STAGES.findIndex(s => s.id === currentStageId);
    const completedCount = completedStages.length;
    const totalStages = JOURNEY_STAGES.length;

    // Current stage contributes partial progress
    const currentStagePercent = stageProgress[currentStageId] || 0;
    const currentStageContribution = currentStagePercent / totalStages;

    const totalProgress = ((completedCount / totalStages) * 100) + currentStageContribution;
    return Math.min(Math.round(totalProgress), 100);
  };

  // Get stage status
  const getStageStatus = (stageId) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (stageId === currentStageId) return 'in_progress';

    const currentIndex = JOURNEY_STAGES.findIndex(s => s.id === currentStageId);
    const stageIndex = JOURNEY_STAGES.findIndex(s => s.id === stageId);

    if (stageIndex < currentIndex) return 'completed';
    return 'pending';
  };

  // Handle stage click
  const handleStageClick = (stage, status) => {
    if (status === 'pending') return; // Don't allow clicking future stages

    setExpandedStage(expandedStage === stage.id ? null : stage.id);

    if (onStageClick) {
      onStageClick(stage, status);
    }
  };

  const overallProgress = calculateProgress();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            Candidate Journey
          </Typography>
          <Tooltip title="Your progress through the recruitment process">
            <IconButton size="small">
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Track your progress from registration to successful placement
        </Typography>

        {/* Overall Progress Bar */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              Overall Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" color="success" />
              <Typography variant="h6" fontWeight={700} color="primary">
                {overallProgress}%
              </Typography>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{
              height: 12,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
              },
            }}
          />
        </Box>
      </Box>

      {/* Timeline View */}
      {showTimeline ? (
        <Stepper
          activeStep={JOURNEY_STAGES.findIndex(s => s.id === currentStageId)}
          orientation="vertical"
          connector={<StyledStepConnector />}
        >
          {JOURNEY_STAGES.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const StatusIcon = STATUS_CONFIG[status]?.icon || RadioButtonUnchecked;
            const StageIcon = stage.icon;
            const stageDate = stageDates[stage.id];
            const progress = stageProgress[stage.id] || 0;
            const isExpanded = expandedStage === stage.id;

            return (
              <Step key={stage.id} completed={status === 'completed'} active={status === 'in_progress'}>
                <StepLabel
                  StepIconComponent={() => (
                    <StageIconWrapper
                      status={status}
                      stageColor={stage.color}
                      onClick={() => handleStageClick(stage, status)}
                    >
                      <StageIcon fontSize="medium" />
                    </StageIconWrapper>
                  )}
                >
                  <Box sx={{ ml: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography
                        variant="h6"
                        fontWeight={status === 'in_progress' ? 600 : 500}
                        color={status === 'pending' ? 'text.secondary' : 'text.primary'}
                      >
                        {stage.label}
                      </Typography>

                      <Chip
                        label={STATUS_CONFIG[status]?.label}
                        color={STATUS_CONFIG[status]?.color}
                        size="small"
                        icon={<StatusIcon fontSize="small" />}
                      />

                      {stageDate && (
                        <Chip
                          label={format(new Date(stageDate), 'MMM dd, yyyy')}
                          size="small"
                          icon={<CalendarToday fontSize="small" />}
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {stage.description}
                    </Typography>

                    {/* Stage Progress (for in-progress stages) */}
                    {status === 'in_progress' && progress > 0 && (
                      <Box sx={{ mt: 1, maxWidth: 300 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Stage Progress
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 6,
                            borderRadius: 1,
                            backgroundColor: alpha(stage.color, 0.2),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: stage.color,
                              borderRadius: 1,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </StepLabel>

                {/* Task List (expandable) */}
                {showTasks && status !== 'pending' && (
                  <StepContent>
                    <TimelineCard
                      isActive={status === 'in_progress'}
                      isCompleted={status === 'completed'}
                      onClick={() => handleStageClick(stage, status)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Key Tasks:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                          {stage.tasks.map((task, taskIndex) => (
                            <Typography
                              key={taskIndex}
                              component="li"
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {task}
                            </Typography>
                          ))}
                        </Box>
                      </CardContent>
                    </TimelineCard>
                  </StepContent>
                )}
              </Step>
            );
          })}
        </Stepper>
      ) : (
        /* Horizontal Progress View (Alternative) */
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              minWidth: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'flex-start' : 'space-between',
            }}
          >
            {JOURNEY_STAGES.map((stage, index) => {
              const status = getStageStatus(stage.id);
              const StageIcon = stage.icon;
              const stageDate = stageDates[stage.id];

              return (
                <Box
                  key={stage.id}
                  sx={{
                    flex: isMobile ? '0 0 120px' : 1,
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Connector Line */}
                  {index < JOURNEY_STAGES.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        left: '60%',
                        right: '-40%',
                        height: 3,
                        backgroundColor: status === 'completed'
                          ? theme.palette.success.main
                          : theme.palette.divider,
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Stage Icon */}
                  <Box sx={{ position: 'relative', zIndex: 1, mb: 1 }}>
                    <StageIconWrapper
                      status={status}
                      stageColor={stage.color}
                      onClick={() => handleStageClick(stage, status)}
                      sx={{ mx: 'auto' }}
                    >
                      <StageIcon fontSize="medium" />
                    </StageIconWrapper>
                  </Box>

                  {/* Stage Label */}
                  <Typography
                    variant="caption"
                    fontWeight={status === 'in_progress' ? 600 : 500}
                    color={status === 'pending' ? 'text.secondary' : 'text.primary'}
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    {stage.label}
                  </Typography>

                  {/* Status Badge */}
                  <Chip
                    label={STATUS_CONFIG[status]?.label}
                    color={STATUS_CONFIG[status]?.color}
                    size="small"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />

                  {/* Date */}
                  {stageDate && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {format(new Date(stageDate), 'MMM dd')}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Summary */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Current Stage:</strong> {JOURNEY_STAGES.find(s => s.id === currentStageId)?.label || 'Registration'}
          <br />
          <strong>Completed Stages:</strong> {completedStages.length} of {JOURNEY_STAGES.length}
          <br />
          <strong>Estimated Completion:</strong> {completedStages.length === JOURNEY_STAGES.length
            ? 'Completed!'
            : `${JOURNEY_STAGES.length - completedStages.length} stages remaining`}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CandidateJourneyTracker;
