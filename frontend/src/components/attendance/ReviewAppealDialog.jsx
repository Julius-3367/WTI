import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import attendanceAppealService from '../../api/attendanceAppeal';

const ReviewAppealDialog = ({ open, onClose, appeal, onReviewComplete, isAdmin = false }) => {
  const [action, setAction] = useState('');
  const [comments, setComments] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    if (!action) {
      enqueueSnackbar('Please select an action (Approve or Reject)', { variant: 'warning' });
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        action,
        comments: comments.trim() || null,
        newStatus: action === 'APPROVED' ? (newStatus || appeal.requestedStatus || 'EXCUSED') : null,
      };

      if (isAdmin) {
        await attendanceAppealService.overrideAppeal(appeal.id, reviewData);
        enqueueSnackbar(`Appeal ${action.toLowerCase()} (admin override)`, { variant: 'success' });
      } else {
        await attendanceAppealService.reviewAppeal(appeal.id, reviewData);
        enqueueSnackbar(`Appeal ${action.toLowerCase()} successfully`, { variant: 'success' });
      }

      handleClose();
      if (onReviewComplete) onReviewComplete();
    } catch (error) {
      console.error('Error reviewing appeal:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to review appeal',
        { variant: 'error' }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAction('');
    setComments('');
    setNewStatus('');
    onClose();
  };

  if (!appeal) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isAdmin ? 'Admin Override - ' : 'Review '} Attendance Appeal
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Appeal Details */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Appeal Information
          </Typography>
          <Stack spacing={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2"><strong>Student:</strong></Typography>
              <Typography variant="body2">
                {appeal.candidate?.fullName || appeal.candidate?.user?.firstName + ' ' + appeal.candidate?.user?.lastName}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2"><strong>Course:</strong></Typography>
              <Typography variant="body2">{appeal.attendanceRecord?.course?.title}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2"><strong>Date:</strong></Typography>
              <Typography variant="body2">
                {format(new Date(appeal.attendanceRecord?.date), 'MMMM dd, yyyy')}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2"><strong>Original Status:</strong></Typography>
              <Chip
                label={appeal.originalStatus}
                size="small"
                color={appeal.originalStatus === 'ABSENT' ? 'error' : 'warning'}
              />
            </Box>
            {appeal.requestedStatus && (
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2"><strong>Requested Status:</strong></Typography>
                <Chip
                  label={appeal.requestedStatus}
                  size="small"
                  color="info"
                />
              </Box>
            )}
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2"><strong>Submitted:</strong></Typography>
              <Typography variant="body2">
                {format(new Date(appeal.createdAt), 'MMM dd, yyyy hh:mm a')}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Student's Reason */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Student's Reason:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {appeal.reason}
          </Typography>
        </Alert>

        {/* Supporting Documents */}
        {appeal.supportingDocuments && JSON.parse(appeal.supportingDocuments).length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Supporting Documents:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {JSON.parse(appeal.supportingDocuments).map((doc, index) => (
                <Chip key={index} label={doc} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        )}

        {/* Review Form */}
        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Your Decision
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Action *</InputLabel>
            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              label="Action *"
            >
              <MenuItem value="APPROVED">
                <Box display="flex" alignItems="center" gap={1}>
                  <ApproveIcon fontSize="small" color="success" />
                  Approve Appeal
                </Box>
              </MenuItem>
              <MenuItem value="REJECTED">
                <Box display="flex" alignItems="center" gap={1}>
                  <RejectIcon fontSize="small" color="error" />
                  Reject Appeal
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {action === 'APPROVED' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>New Attendance Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="New Attendance Status"
              >
                <MenuItem value="">
                  <em>Use requested status ({appeal.requestedStatus || 'EXCUSED'})</em>
                </MenuItem>
                <MenuItem value="PRESENT">PRESENT - Student attended</MenuItem>
                <MenuItem value="EXCUSED">EXCUSED - Valid absence</MenuItem>
                <MenuItem value="LATE">LATE - Attended but late</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            label="Comments (Optional)"
            multiline
            rows={3}
            fullWidth
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments or feedback for the student..."
            helperText={`${comments.length}/300 characters`}
            inputProps={{ maxLength: 300 }}
          />
        </Box>

        {action === 'APPROVED' && (
          <Alert severity="success">
            ✅ Approving this appeal will change the attendance status to{' '}
            <strong>{newStatus || appeal.requestedStatus || 'EXCUSED'}</strong>.
          </Alert>
        )}

        {action === 'REJECTED' && (
          <Alert severity="warning">
            ⚠️ Rejecting this appeal will keep the original <strong>{appeal.originalStatus}</strong> status.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !action}
          color={action === 'APPROVED' ? 'success' : action === 'REJECTED' ? 'error' : 'primary'}
        >
          {submitting ? 'Submitting...' : action === 'APPROVED' ? 'Approve Appeal' : action === 'REJECTED' ? 'Reject Appeal' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewAppealDialog;
