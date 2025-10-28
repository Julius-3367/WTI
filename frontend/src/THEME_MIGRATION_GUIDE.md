# Theme Migration Guide: Converting Components to Use Material-UI Theme

This guide provides instructions for migrating existing dashboard components and pages from Tailwind CSS to Material-UI components that properly utilize the `theme.js` configuration.

## Overview

The UMSL Labor Mobility platform has a comprehensive Material-UI theme configured in `src/theme/theme.js` with:
- UMSL brand colors (Deep Blue primary, Lime Green secondary)
- Custom color palette for labor mobility status indicators
- Complete typography system
- Enhanced component overrides
- RTL and dark mode support

However, many dashboard components are currently using Tailwind CSS classes instead of Material-UI components, which means they're not benefiting from the theme system.

## Migration Strategy

### 1. Replace HTML Elements with Material-UI Components

#### Before (Tailwind CSS):
```jsx
<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
  <p className="text-gray-600 mt-1">System management overview</p>
</div>
```

#### After (Material-UI with Theme):
```jsx
import { Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const theme = useTheme();

<Paper
  sx={{
    p: 3,
    mb: 3,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    borderRadius: 2,
  }}
>
  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
    Admin Dashboard
  </Typography>
  <Typography variant="body1" sx={{ opacity: 0.9 }}>
    System management overview
  </Typography>
</Paper>
```

### 2. Use Theme Colors Instead of Hard-coded Colors

#### Theme Color Palette:
```javascript
// Primary colors (Deep Blue)
theme.palette.primary.main    // #0077B6
theme.palette.primary.light   // #38A0D1
theme.palette.primary.dark    // #005F9A

// Secondary colors (Lime Green)
theme.palette.secondary.main  // #78BE21
theme.palette.secondary.light // #A4D65E
theme.palette.secondary.dark  // #5AA31A

// Status colors
theme.palette.success.main    // #22c55e (for approved/completed)
theme.palette.error.main      // #ef4444 (for rejected/failed)
theme.palette.warning.main    // #f59e0b (for pending/warning)
theme.palette.info.main       // #00A2DB (for information)

// Custom labor mobility colors
theme.palette.custom.pending   // #f59e0b
theme.palette.custom.approved  // #22c55e
theme.palette.custom.rejected  // #ef4444
theme.palette.custom.active    // #0077B6
```

### 3. Typography Migration

#### Before:
```jsx
<h1 className="text-2xl font-bold text-gray-900">Title</h1>
<p className="text-sm text-gray-500">Subtitle</p>
```

#### After:
```jsx
<Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
  Title
</Typography>
<Typography variant="body2" color="text.secondary">
  Subtitle
</Typography>
```

### 4. Card Components Migration

#### Before:
```jsx
<div className="bg-white overflow-hidden shadow rounded-lg">
  <div className="p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <UserIcon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-500">Total Users</p>
        <p className="text-lg font-medium text-gray-900">2,847</p>
      </div>
    </div>
  </div>
</div>
```

#### After:
```jsx
import { Card, CardContent, Avatar, Box, Typography } from '@mui/material';
import { UserGroupIcon } from '@heroicons/react/24/outline';

<Card
  sx={{
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  }}
>
  <CardContent>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Avatar
        sx={{
          backgroundColor: `${theme.palette.primary.main}20`,
          color: theme.palette.primary.main,
          mr: 2,
        }}
      >
        <UserGroupIcon style={{ width: 24, height: 24 }} />
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary">
          Total Users
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          2,847
        </Typography>
      </Box>
    </Box>
  </CardContent>
</Card>
```

### 5. Button Migration

#### Before:
```jsx
<button
  type="button"
  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
>
  Add User
</button>
```

#### After:
```jsx
import { Button } from '@mui/material';
import { PlusIcon } from '@heroicons/react/24/outline';

<Button
  variant="contained"
  fullWidth
  startIcon={<PlusIcon style={{ width: 20, height: 20 }} />}
  sx={{ justifyContent: 'flex-start' }}
>
  Add User
</Button>
```

### 6. Form Components Migration

#### Before:
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Search
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
    placeholder="Search users..."
  />
</div>
```

#### After:
```jsx
import { TextField, InputAdornment } from '@mui/material';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

<TextField
  fullWidth
  label="Search"
  placeholder="Search users..."
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <MagnifyingGlassIcon style={{ width: 20, height: 20 }} />
      </InputAdornment>
    ),
  }}
  sx={{ mb: 2 }}
/>
```

### 7. Layout Components

#### Before:
```jsx
<div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Content */}
  </div>
</div>
```

#### After:
```jsx
import { Container, Grid } from '@mui/material';

<Container maxWidth="xl" sx={{ py: 3 }}>
  <Grid container spacing={3}>
    {/* Content */}
  </Grid>
</Container>
```

## Complete Component Migration Examples

### Example 1: Stats Card Component

```jsx
// StatsCard.jsx - Theme-aware component
import React from 'react';
import { Card, CardContent, Avatar, Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

const StatsCard = ({ title, value, change, trend, icon: Icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              backgroundColor: `${color}20`,
              color: color,
              mr: 2,
            }}
          >
            <Icon style={{ width: 24, height: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            size="small"
            label={change}
            sx={{
              backgroundColor: trend === 'up' ? theme.palette.success.light : theme.palette.error.light,
              color: trend === 'up' ? theme.palette.success.dark : theme.palette.error.dark,
              fontWeight: 600,
            }}
          />
          {trend === 'up' ? (
            <ArrowTrendingUpIcon
              style={{
                width: 16,
                height: 16,
                color: theme.palette.success.main,
                marginLeft: 8,
              }}
            />
          ) : (
            <ArrowTrendingDownIcon
              style={{
                width: 16,
                height: 16,
                color: theme.palette.error.main,
                marginLeft: 8,
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
```

### Example 2: Progress Card Component

```jsx
// ProgressCard.jsx - Theme-aware component
import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ProgressCard = ({ title, progress, color, description }) => {
  const theme = useTheme();
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                bgcolor: color || theme.palette.primary.main,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
```

## Migration Checklist

### For Each Component:

- [ ] Replace `div` elements with appropriate Material-UI components
- [ ] Replace `className` with `sx` prop for styling
- [ ] Use theme colors instead of hard-coded colors
- [ ] Import and use `useTheme` hook
- [ ] Replace HTML headings with `Typography` component
- [ ] Replace HTML buttons with `Button` component
- [ ] Replace HTML forms with Material-UI form components
- [ ] Use `Container`, `Grid`, `Box`, and `Stack` for layouts
- [ ] Apply proper spacing using theme.spacing
- [ ] Use theme shadows instead of custom box-shadows
- [ ] Implement hover effects using theme transitions

### Testing Your Migration:

1. **Visual Consistency**: Ensure components match the design system
2. **Theme Colors**: Verify all colors come from the theme palette
3. **Typography**: Check that all text uses theme typography variants
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Ensure proper contrast ratios and keyboard navigation
6. **Dark Mode**: Test with the dark theme variant (if implemented)
7. **RTL Support**: Test with the RTL theme variant (if needed)

## Common Patterns

### Status Indicators:
```jsx
const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return theme.palette.custom.active;
    case 'pending':
      return theme.palette.custom.pending;
    case 'approved':
      return theme.palette.custom.approved;
    case 'rejected':
      return theme.palette.custom.rejected;
    default:
      return theme.palette.grey[500];
  }
};

<Chip
  label={status}
  sx={{
    bgcolor: getStatusColor(status),
    color: 'white',
    fontWeight: 600,
  }}
/>
```

### Gradient Backgrounds:
```jsx
<Paper
  sx={{
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: 'white',
  }}
>
```

### Hover Effects:
```jsx
<Card
  sx={{
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  }}
>
```

## Tools and Resources

1. **Material-UI Documentation**: https://mui.com/material-ui/
2. **Theme Configuration**: `src/theme/theme.js`
3. **Example Components**: 
   - `src/pages/admin/AdminDashboardThemed.jsx`
   - `src/pages/candidate/DashboardThemed.jsx`
   - `src/layouts/AppLayoutThemed.jsx`
4. **Theme Inspector**: Use browser dev tools to inspect theme values
5. **Material-UI Theme Creator**: https://zenoo.github.io/mui-theme-creator/

## Next Steps

1. Start with the most commonly used components
2. Create reusable themed components in `src/components/themed/`
3. Update all dashboard pages to use the themed versions
4. Test across different user roles and screen sizes
5. Consider implementing dark mode toggle functionality
6. Add RTL language support if needed

Remember: The goal is to create a consistent, accessible, and maintainable design system that fully leverages the comprehensive theme configuration already in place.