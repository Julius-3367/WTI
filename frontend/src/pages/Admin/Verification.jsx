import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Menu,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  CheckCircle,
  Cancel,
  Pending,
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  Work,
  Description,
  CloudUpload,
  ExpandMore,
  Warning,
  VerifiedUser,
  Gavel,
  AssignmentInd,
  Badge,
  CreditCard,
} from '@mui/icons-material';

const Verification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationType, setVerificationType] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [tabValue, setTabValue] = useState('pending');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef(null);

  // Sample verification requests
  const verificationRequests = [
    {
      id: 1,
      type: 'identity',
      user: {
        id: 'USR-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'candidate',
        avatar: '',
      },
      status: 'pending',
      submittedDate: '2023-06-15',
      documents: [
        { id: 1, type: 'passport', name: 'passport.pdf', verified: false },
        { id: 2, type: 'selfie', name: 'selfie.jpg', verified: false },
      ],
      details: {
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        documentNumber: 'A12345678',
        expiryDate: '2030-05-15',
        country: 'United States',
      },
    },
    {
      id: 2,
      type: 'employment',
      user: {
        id: 'USR-002',
        name: 'Acme Inc.',
        email: 'hr@acme.com',
        role: 'employer',
        avatar: '',
      },
      status: 'pending',
      submittedDate: '2023-06-10',
      documents: [
        { id: 3, type: 'business_license', name: 'business_license.pdf', verified: false },
        { id: 4, type: 'tax_id', name: 'tax_id.pdf', verified: false },
      ],
      details: {
        companyName: 'Acme Inc.',
        registrationNumber: '123456789',
        taxId: 'TAX-987654321',
        address: '123 Business Ave, New York, NY 10001',
        industry: 'Technology',
      },
    },
    // Add more sample verification requests as needed
  ];

  const handleMenuClick = (event, verification) => {
    setAnchorEl(event.currentTarget);
    setSelectedVerification(verification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (verification) => {
    setSelectedVerification(verification);
    setViewDialogOpen(true);
  };

  const handleApprove = (verificationId) => {
    // Handle approval logic
    console.log(`Approved verification ${verificationId}`);
    handleMenuClose();
  };

  const handleRejectClick = (verification) => {
    setSelectedVerification(verification);
    setRejectDialogOpen(true);
    handleMenuClose();
  };

  const handleRejectConfirm = () => {
    // Handle rejection logic with reason
    console.log(`Rejected verification ${selectedVerification.id} with reason: ${rejectReason}`);
    setRejectDialogOpen(false);
    setRejectReason('');
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setRejectReason('');
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic
      console.log('File selected:', file.name);
    }
  };

  const filteredVerifications = verificationRequests.filter((verification) => {
    const matchesSearch = Object.values(verification.user).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesTab = tabValue === 'all' || verification.status === tabValue;
    const matchesType = verificationType === 'all' || verification.type === verificationType;
    
    return matchesSearch && matchesTab && matchesType;
  });

  const getStatusChip = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Chip icon={<Pending />} label="Pending" color="warning" size="small" />;
      case 'approved':
        return <Chip icon={<CheckCircle />} label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />;
      case 'in_review':
        return <Chip icon={<HourglassEmpty />} label="In Review" color="info" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getVerificationTypeIcon = (type) => {
    switch (type) {
      case 'identity':
        return <AssignmentInd color="primary" />;
      case 'employment':
        return <Work color="secondary" />;
      case 'education':
        return <School color="info" />;
      case 'payment':
        return <CreditCard color="success" />;
      default:
        return <VerifiedUser />;
    }
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'passport': 'Passport',
      'selfie': 'Selfie',
      'business_license': 'Business License',
      'tax_id': 'Tax ID',
      'diploma': 'Diploma',
      'transcript': 'Transcript',
    };
    return labels[type] || type.replace('_', ' ');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Verification Requests
        </Typography>
        <Box>
          <TextField
            size="small"
            placeholder="Search verifications..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Verification Type</InputLabel>
            <Select
              value={verificationType}
              label="Verification Type"
              onChange={(e) => setVerificationType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="identity">Identity</MenuItem>
              <MenuItem value="employment">Employment</MenuItem>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="payment">Payment</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Badge badgeContent={verificationRequests.filter(v => v.status === 'pending').length} color="error" sx={{ mr: 1 }}>
                Pending
              </Badge>
            } 
            value="pending" 
          />
          <Tab 
            label={
              <Badge badgeContent={verificationRequests.filter(v => v.status === 'in_review').length} color="warning" sx={{ mr: 1 }}>
                In Review
              </Badge>
            } 
            value="in_review" 
          />
          <Tab 
            label={
              <Badge badgeContent={verificationRequests.filter(v => v.status === 'approved').length} color="success" sx={{ mr: 1 }}>
                Approved
              </Badge>
            } 
            value="approved" 
          />
          <Tab 
            label={
              <Badge badgeContent={verificationRequests.filter(v => v.status === 'rejected').length} color="default" sx={{ mr: 1 }}>
                Rejected
              </Badge>
            } 
            value="rejected" 
          />
          <Tab label="All" value="all" />
        </Tabs>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVerifications.length > 0 ? (
                filteredVerifications
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((verification) => (
                    <TableRow key={verification.id} hover>
                      <TableCell>VR-{String(verification.id).padStart(4, '0')}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={verification.user.avatar} 
                            sx={{ width: 32, height: 32, mr: 1 }}
                          >
                            {verification.user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{verification.user.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {verification.user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getVerificationTypeIcon(verification.type)}
                          <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                            {verification.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{verification.submittedDate}</TableCell>
                      <TableCell>{getStatusChip(verification.status)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Details" TransitionComponent={Zoom} arrow>
                          <IconButton
                            onClick={() => handleViewDetails(verification)}
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Actions" TransitionComponent={Zoom} arrow>
                          <IconButton
                            onClick={(e) => handleMenuClick(e, verification)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Description sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="subtitle1" color="text.secondary">
                        No verification requests found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {searchTerm ? 'Try adjusting your search or filter' : 'All verification requests are processed'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredVerifications.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredVerifications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* View Verification Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedVerification && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getVerificationTypeIcon(selectedVerification.type)}
                <Typography variant="h6" component="span" sx={{ ml: 1, textTransform: 'capitalize' }}>
                  {selectedVerification.type} Verification
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip 
                  label={selectedVerification.status} 
                  color={
                    selectedVerification.status === 'approved' ? 'success' :
                    selectedVerification.status === 'rejected' ? 'error' :
                    selectedVerification.status === 'pending' ? 'warning' : 'default'
                  } 
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                Request ID: VR-{String(selectedVerification.id).padStart(4, '0')} • Submitted on {selectedVerification.submittedDate}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader 
                      title="User Information" 
                      avatar={
                        <Avatar 
                          src={selectedVerification.user.avatar}
                          sx={{ width: 40, height: 40 }}
                        >
                          {selectedVerification.user.name.charAt(0)}
                        </Avatar>
                      }
                    />
                    <CardContent>
                      <List dense>
                        <ListItem>
                          <ListItemAvatar>
                            <Person color="action" />
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Name" 
                            secondary={selectedVerification.user.name} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Email color="action" />
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Email" 
                            secondary={selectedVerification.user.email} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Badge color="action" />
                          </ListItemAvatar>
                          <ListItemText 
                            primary="User ID" 
                            secondary={selectedVerification.user.id} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Work color="action" />
                          </ListItemAvatar>
                          <ListItemText 
                            primary="Role" 
                            secondary={selectedVerification.user.role} 
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardHeader 
                      title="Verification Details" 
                      action={
                        <Button 
                          size="small" 
                          color="primary"
                          startIcon={<CloudUpload />}
                          onClick={() => fileInputRef.current.click()}
                        >
                          Upload Document
                        </Button>
                      }
                    />
                    <CardContent>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <List dense>
                        {Object.entries(selectedVerification.details).map(([key, value]) => (
                          <ListItem key={key}>
                            <ListItemText 
                              primary={key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())} 
                              secondary={value || 'Not provided'}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Submitted Documents
                      </Typography>
                      <List dense>
                        {selectedVerification.documents.map((doc) => (
                          <ListItem 
                            key={doc.id}
                            secondaryAction={
                              <IconButton edge="end" size="small">
                                <CloudDownload />
                              </IconButton>
                            }
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              mb: 1,
                            }}
                          >
                            <ListItemAvatar>
                              <Description color="action" />
                            </ListItemAvatar>
                            <ListItemText 
                              primary={getDocumentTypeLabel(doc.type)}
                              secondary={doc.name}
                            />
                            {doc.verified ? (
                              <CheckCircle color="success" fontSize="small" />
                            ) : (
                              <Pending color="warning" fontSize="small" />
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Accordion expanded={expanded} onChange={handleExpandClick}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Verification Notes & History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add internal notes about this verification..."
                        variant="outlined"
                        margin="normal"
                      />
                      <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                          Save Notes
                        </Button>
                        <Button variant="outlined" onClick={handleExpandClick}>
                          Cancel
                        </Button>
                      </Box>
                      
                      <List dense sx={{ mt: 2 }}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <Person />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Verification submitted"
                            secondary="June 15, 2023 10:30 AM"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                              <Gavel />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Assigned to Admin User"
                            secondary="June 15, 2023 11:15 AM"
                          />
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button 
                onClick={() => setViewDialogOpen(false)}
                color="inherit"
              >
                Close
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button 
                onClick={() => handleRejectClick(selectedVerification)}
                color="error"
                variant="outlined"
                startIcon={<Cancel />}
                sx={{ mr: 1 }}
              >
                Reject
              </Button>
              <Button 
                onClick={() => handleApprove(selectedVerification.id)}
                color="primary"
                variant="contained"
                startIcon={<CheckCircle />}
              >
                Approve
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Verification Request</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to reject this verification request? Please provide a reason for rejection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reject-reason"
            label="Reason for rejection"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <FormGroup sx={{ mt: 2 }}>
            <FormControlLabel 
              control={<Switch />} 
              label="Notify user via email" 
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancel} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleRejectConfirm} 
            color="error"
            variant="contained"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewDetails(selectedVerification);
          handleMenuClose();
        }}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={() => {
          handleApprove(selectedVerification?.id);
          handleMenuClose();
        }}>
          <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} /> Approve
        </MenuItem>
        <MenuItem onClick={() => {
          handleRejectClick(selectedVerification);
        }}>
          <Cancel fontSize="small" sx={{ mr: 1, color: 'error.main' }} /> Reject
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <AssignmentInd fontSize="small" sx={{ mr: 1 }} /> Assign to Me
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Description fontSize="small" sx={{ mr: 1 }} /> Request More Info
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Verification;
