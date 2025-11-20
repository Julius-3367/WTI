import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera as CameraIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  School as EducationIcon,
  Work as WorkIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import candidateService from '../../api/candidate';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_BASE_URL.replace('/api', '');

const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Other'];
const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Other'
];
const EDUCATION_LEVELS = [
  'Primary', 'Secondary', 'Certificate', 'Diploma',
  'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Other'
];
const MARITAL_STATUS = ['Single', 'Married', 'Divorced', 'Widowed'];

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: null,
    nationalIdPassport: '',
    county: '',
    maritalStatus: '',
    highestEducation: '',
    relevantSkills: '',
    previousEmployer: '',
    previousRole: '',
    previousDuration: '',
    preferredCountry: '',
    jobTypePreference: '',
    willingToRelocate: false,
    languages: [],
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getProfile();
      setProfile(response);

      // Populate form data
      setFormData({
        fullName: response.fullName || '',
        gender: response.gender || '',
        dob: response.dob ? new Date(response.dob) : null,
        nationalIdPassport: response.nationalIdPassport || '',
        county: response.county || '',
        maritalStatus: response.maritalStatus || '',
        highestEducation: response.highestEducation || '',
        relevantSkills: response.relevantSkills || '',
        previousEmployer: response.previousEmployer || '',
        previousRole: response.previousRole || '',
        previousDuration: response.previousDuration || '',
        preferredCountry: response.preferredCountry || '',
        jobTypePreference: response.jobTypePreference || '',
        willingToRelocate: response.willingToRelocate || false,
        languages: response.languages || [],
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      enqueueSnackbar('Failed to load profile', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await candidateService.updateProfile(formData);
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to update profile', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('File size must be less than 5MB', { variant: 'error' });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please upload an image file', { variant: 'error' });
      return;
    }

    try {
      setSaving(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'profile_photo');

      console.log('📤 Frontend sending:', {
        isFormData: uploadFormData instanceof FormData,
        file: file,
        type: 'profile_photo'
      });

      const response = await candidateService.uploadDocument(uploadFormData);

      console.log('📸 Upload response:', response);

      // Update profile with new photo URL
      await candidateService.updateProfile({
        profilePhotoUrl: response.data?.fileUrl || response.fileUrl
      });

      enqueueSnackbar('Photo uploaded successfully', { variant: 'success' });
      fetchProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to upload photo', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Avatar
            src={profile?.profilePhotoUrl ? `${BACKEND_URL}${profile.profilePhotoUrl}` : undefined}
            sx={{ width: 100, height: 100 }}
          >
            {!profile?.profilePhotoUrl && profile?.fullName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" gutterBottom>
              Profile Photo
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-photo-upload"
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="profile-photo-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CameraIcon />}
                size="small"
                disabled={saving}
              >
                Upload Photo
              </Button>
            </label>
            {profile?.profilePhotoUrl && (
              <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                Current: {profile.profilePhotoUrl.split('/').pop()}
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            label="Gender"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of Birth"
            value={formData.dob}
            onChange={(date) => handleChange('dob', date)}
            slotProps={{
              textField: { fullWidth: true }
            }}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="National ID / Passport"
          value={formData.nationalIdPassport}
          onChange={(e) => handleChange('nationalIdPassport', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>County</InputLabel>
          <Select
            value={formData.county}
            onChange={(e) => handleChange('county', e.target.value)}
            label="County"
          >
            {COUNTIES.map(county => (
              <MenuItem key={county} value={county}>{county}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Marital Status</InputLabel>
          <Select
            value={formData.maritalStatus}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
            label="Marital Status"
          >
            {MARITAL_STATUS.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Phone Number"
          value={profile?.user?.phone || ''}
          disabled
          helperText="Contact admin to update phone number"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email Address"
          value={profile?.user?.email || ''}
          disabled
          helperText="Contact admin to update email address"
        />
      </Grid>
    </Grid>
  );

  const renderEducation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Highest Education Level</InputLabel>
          <Select
            value={formData.highestEducation}
            onChange={(e) => handleChange('highestEducation', e.target.value)}
            label="Highest Education Level"
          >
            {EDUCATION_LEVELS.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Relevant Skills"
          value={formData.relevantSkills}
          onChange={(e) => handleChange('relevantSkills', e.target.value)}
          multiline
          rows={4}
          helperText="List your skills separated by commas"
          placeholder="e.g., Construction, Plumbing, Electrical work, etc."
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Languages Spoken
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {['English', 'Swahili', 'Arabic', 'French', 'Other'].map(lang => (
            <Chip
              key={lang}
              label={lang}
              onClick={() => {
                const languages = formData.languages || [];
                const updated = languages.includes(lang)
                  ? languages.filter(l => l !== lang)
                  : [...languages, lang];
                handleChange('languages', updated);
              }}
              color={formData.languages?.includes(lang) ? 'primary' : 'default'}
              variant={formData.languages?.includes(lang) ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const renderWorkHistory = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info">
          Provide details about your previous employment to help us match you with suitable opportunities.
        </Alert>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Previous Employer"
          value={formData.previousEmployer}
          onChange={(e) => handleChange('previousEmployer', e.target.value)}
          placeholder="Company or organization name"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Previous Role"
          value={formData.previousRole}
          onChange={(e) => handleChange('previousRole', e.target.value)}
          placeholder="Job title or position"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Duration"
          value={formData.previousDuration}
          onChange={(e) => handleChange('previousDuration', e.target.value)}
          placeholder="e.g., 2 years"
        />
      </Grid>
    </Grid>
  );

  const renderPreferences = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info">
          Your preferences help us find the best job opportunities for you.
        </Alert>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Preferred Country</InputLabel>
          <Select
            value={formData.preferredCountry}
            onChange={(e) => handleChange('preferredCountry', e.target.value)}
            label="Preferred Country"
          >
            {COUNTRIES.map(country => (
              <MenuItem key={country} value={country}>{country}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Job Type Preference"
          value={formData.jobTypePreference}
          onChange={(e) => handleChange('jobTypePreference', e.target.value)}
          placeholder="e.g., Construction, Healthcare, Hospitality"
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.willingToRelocate}
              onChange={(e) => handleChange('willingToRelocate', e.target.checked)}
            />
          }
          label="I am willing to relocate for work opportunities"
        />
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information and preferences
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<PersonIcon />} label="Personal Info" />
          <Tab icon={<EducationIcon />} label="Education & Skills" />
          <Tab icon={<WorkIcon />} label="Work History" />
          <Tab icon={<SettingsIcon />} label="Preferences" />
        </Tabs>
      </Paper>

      {/* Content */}
      <Paper sx={{ p: 3 }}>
        {tabValue === 0 && renderPersonalInfo()}
        {tabValue === 1 && renderEducation()}
        {tabValue === 2 && renderWorkHistory()}
        {tabValue === 3 && renderPreferences()}

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={fetchProfile}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileSettings;
