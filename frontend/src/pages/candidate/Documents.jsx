import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Description as FileIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import candidateService from '../../api/candidate';

// Document types for candidates
const DOCUMENT_TYPES = [
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'NATIONAL_ID', label: 'National ID' },
  { value: 'POLICE_CLEARANCE', label: 'Police Clearance' },
  { value: 'MEDICAL_CERTIFICATE', label: 'Medical Certificate' },
  { value: 'EDUCATION_CERTIFICATE', label: 'Education Certificate' },
  { value: 'VISA', label: 'Visa Document' },
  { value: 'WORK_PERMIT', label: 'Work Permit' },
  { value: 'REFERENCE_LETTER', label: 'Reference Letter' },
  { value: 'RESUME_CV', label: 'Resume/CV' },
  { value: 'OTHER', label: 'Other' },
];

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  // Form state
  const [documentType, setDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getDocuments();
      console.log('📄 Fetched documents:', response);
      console.log('📄 Documents count:', response?.length || 0);
      if (response && response.length > 0) {
        console.log('📄 First document:', JSON.stringify(response[0], null, 2));
      }
      setDocuments(response || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      enqueueSnackbar('Failed to load documents', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        enqueueSnackbar('File size must be less than 10MB', { variant: 'error' });
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        enqueueSnackbar('Only PDF, JPEG, and PNG files are allowed', { variant: 'error' });
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!documentType || !selectedFile) {
      enqueueSnackbar('Please select document type and file', { variant: 'warning' });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress (in real implementation, use XMLHttpRequest or axios onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create FormData and send actual file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', documentType);

      console.log('📤 Documents page sending:', {
        isFormData: formData instanceof FormData,
        file: selectedFile,
        type: documentType
      });

      await candidateService.uploadDocument(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      enqueueSnackbar('Document uploaded successfully', { variant: 'success' });
      setUploadDialogOpen(false);
      resetForm();
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      enqueueSnackbar(error.message || 'Failed to upload document', { variant: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;

    try {
      await candidateService.deleteDocument(selectedDocument.id);
      enqueueSnackbar('Document deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      enqueueSnackbar('Failed to delete document', { variant: 'error' });
    }
  };

  const resetForm = () => {
    setDocumentType('');
    setSelectedFile(null);
    setFilePreview(null);
  };

  const getDocumentStatus = (doc) => {
    // Check if document is a required type
    const requiredDocs = ['PASSPORT', 'POLICE_CLEARANCE', 'MEDICAL_CERTIFICATE'];
    if (requiredDocs.includes(doc.documentType)) {
      return { label: 'Required', color: 'success', icon: <CheckIcon /> };
    }
    return { label: 'Optional', color: 'default', icon: null };
  };

  const getMissingDocuments = () => {
    const uploadedTypes = documents.map(d => d.documentType);
    const required = ['PASSPORT', 'POLICE_CLEARANCE', 'MEDICAL_CERTIFICATE'];
    return required.filter(type => !uploadedTypes.includes(type));
  };

  const missingDocs = getMissingDocuments();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload and manage your documents required for training and placement
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Document
        </Button>
      </Box>

      {/* Missing Documents Alert */}
      {missingDocs.length > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Missing Required Documents</Typography>
          <Typography variant="body2">
            Please upload the following required documents: {' '}
            {missingDocs.map(type =>
              DOCUMENT_TYPES.find(dt => dt.value === type)?.label
            ).join(', ')}
          </Typography>
        </Alert>
      )}

      {/* Documents Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total Documents
              </Typography>
              <Typography variant="h4">{documents.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Required Uploaded
              </Typography>
              <Typography variant="h4" color="success.main">
                {3 - missingDocs.length} / 3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Completion Rate
              </Typography>
              <Typography variant="h4">
                {Math.round(((3 - missingDocs.length) / 3) * 100)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Last Upload
              </Typography>
              <Typography variant="h6">
                {documents.length > 0
                  ? format(new Date(documents[0].uploadedAt), 'MMM dd')
                  : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Documents Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded On</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Box py={4}>
                    <FileIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No documents uploaded yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click the "Upload Document" button to get started
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => {
                const status = getDocumentStatus(doc);
                const docType = DOCUMENT_TYPES.find(dt => dt.value === doc.documentType);

                return (
                  <TableRow key={doc.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <FileIcon color="action" />
                        <Typography>{docType?.label || doc.documentType}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        icon={status.icon}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {doc.uploadedByUser
                        ? `${doc.uploadedByUser.firstName} ${doc.uploadedByUser.lastName}`
                        : 'Self'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Document">
                        <IconButton
                          size="small"
                          onClick={() => {
                            const fileUrl = doc.fileUrl.startsWith('http')
                              ? doc.fileUrl
                              : `http://localhost:5000${doc.fileUrl}`;
                            window.open(fileUrl, '_blank');
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploading && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Document Type *</InputLabel>
              <Select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                label="Document Type *"
                disabled={uploading}
              >
                {DOCUMENT_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                backgroundColor: 'background.default',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => !uploading && document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {selectedFile ? (
                <Box>
                  <FileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1">{selectedFile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  {filePreview && (
                    <Box mt={2}>
                      <img
                        src={filePreview}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <Box>
                  <UploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
                  <Typography variant="subtitle1">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PDF, JPEG, or PNG (max 10MB)
                  </Typography>
                </Box>
              )}
            </Box>

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" align="center" mt={1}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={uploading || !documentType || !selectedFile}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this document? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Documents;
