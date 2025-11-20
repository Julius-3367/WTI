import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  Download,
  Upload,
  CheckCircle,
  Pending,
  Error as ErrorIcon,
  Visibility,
  Delete,
  CloudUpload,
  Description,
  Verified,
  Schedule,
  Warning,
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { candidateService } from '../../api/candidate';

/**
 * Certificates & Documents Page
 * Features:
 * - Certificate status tracker
 * - Digital certificate preview/download
 * - Document upload portal
 * - Document verification status
 * - Document expiry tracking
 */
const CertificatesPage = () => {
  const theme = useTheme();
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await candidateService.getCertificatesAndDocuments();
        setCertificates(response.certificates || []);
        setDocuments(response.documents || []);
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
        setError(err.response?.data?.message || 'Failed to load certificates and documents');
        setCertificates([]);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate document completion
  const requiredDocTypes = ['Medical Clearance', 'Police Clearance', 'Passport', 'Education Certificate', 'Resume/CV'];
  const verifiedDocs = documents.filter(d => d.status === 'verified').length;
  const documentCompletion = requiredDocTypes.length > 0 ? Math.round((verifiedDocs / requiredDocTypes.length) * 100) : 0;

  const requiredDocuments = [
    'Medical Clearance',
    'Police Clearance',
    'Passport Copy',
    'Educational Certificate',
    'Resume/CV',
    'Birth Certificate',
    'Proof of Address',
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued':
      case 'verified':
        return 'success';
      case 'processing':
      case 'pending':
        return 'warning';
      case 'missing':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'issued':
      case 'verified':
        return <CheckCircle />;
      case 'processing':
      case 'pending':
        return <Pending />;
      case 'missing':
      case 'rejected':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'error', message: 'Expired' };
    if (daysUntilExpiry < 30) return { status: 'expiring', color: 'warning', message: `Expires in ${daysUntilExpiry} days` };
    return { status: 'valid', color: 'success', message: `Valid until ${format(new Date(expiryDate), 'MMM dd, yyyy')}` };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Documents
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your training certificates and required documents
        </Typography>
      </Box>

      {/* Document Completion Alert */}
      {documentCompletion < 100 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your document verification is {documentCompletion}% complete. Please upload all required documents.
          <LinearProgress
            variant="determinate"
            value={documentCompletion}
            sx={{ mt: 1, height: 8, borderRadius: 1 }}
          />
        </Alert>
      )}

      {/* Certificates Section */}
      <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
        My Certificates
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {certificates.map((cert) => (
          <Grid item xs={12} md={6} lg={4} key={cert.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Chip
                      label={cert.status.toUpperCase()}
                      color={getStatusColor(cert.status)}
                      size="small"
                      icon={getStatusIcon(cert.status)}
                    />
                  </Box>
                  {cert.status === 'issued' && (
                    <IconButton size="small" color="primary">
                      <Verified />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {cert.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Course: {cert.course}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {cert.status === 'issued' && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Issue Date: {format(new Date(cert.issueDate), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Verification Code: {cert.verificationCode}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Download />}
                        fullWidth
                      >
                        Download
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        fullWidth
                        onClick={() => {
                          setSelectedCertificate(cert);
                          setPreviewDialog(true);
                        }}
                      >
                        Preview
                      </Button>
                    </Box>
                  </>
                )}

                {cert.status === 'processing' && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Completed: {format(new Date(cert.completionDate), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Expected: {format(new Date(cert.expectedDate), 'MMM dd, yyyy')}
                    </Typography>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="caption">
                        Your certificate is being processed. You'll be notified when it's ready.
                      </Typography>
                    </Alert>
                  </>
                )}

                {cert.status === 'pending' && (
                  <>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Course Progress: {cert.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={cert.progress}
                      sx={{ mt: 1, height: 8, borderRadius: 1 }}
                    />
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="caption">
                        Complete the course to receive your certificate
                      </Typography>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Required Documents Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Required Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<Upload />}
          onClick={() => setUploadDialog(true)}
        >
          Upload Document
        </Button>
      </Box>

      <Card>
        <CardContent>
          <List>
            {documents.map((doc, index) => {
              const expiryStatus = getExpiryStatus(doc.expiryDate);
              return (
                <React.Fragment key={doc.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Description color={doc.status === 'verified' ? 'success' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body1" fontWeight={500}>
                            {doc.type}
                          </Typography>
                          {doc.required && (
                            <Chip label="Required" size="small" color="error" variant="outlined" />
                          )}
                          <Chip
                            label={doc.status.toUpperCase()}
                            size="small"
                            color={getStatusColor(doc.status)}
                            icon={getStatusIcon(doc.status)}
                          />
                          {expiryStatus && (
                            <Chip
                              label={expiryStatus.message}
                              size="small"
                              color={expiryStatus.color}
                              icon={expiryStatus.status === 'expiring' ? <Warning /> : null}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        doc.fileName ? (
                          <>
                            {doc.fileName} ({doc.size})
                            <br />
                            Uploaded: {format(new Date(doc.uploadDate), 'MMM dd, yyyy')}
                          </>
                        ) : (
                          'Not uploaded'
                        )
                      }
                    />
                    <ListItemSecondaryAction>
                      {doc.fileName ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <Download />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Upload />}
                          onClick={() => setUploadDialog(true)}
                        >
                          Upload
                        </Button>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < documents.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select document type:
            </Typography>
            <select style={{ width: '100%', padding: '10px', marginBottom: '20px' }}>
              {requiredDocuments.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>

            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: `2px dashed ${theme.palette.divider}`,
                cursor: 'pointer',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Drag and drop your file here
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or
              </Typography>
              <Button variant="outlined">Browse Files</Button>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Preview Dialog */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Certificate Preview
          {selectedCertificate && ` - ${selectedCertificate.name}`}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.grey[100],
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Certificate preview would appear here
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificatesPage;
