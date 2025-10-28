import React, { useState, useMemo } from 'react';
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Typography,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { formatDate, getRelativeTime } from '../../utils/dateUtils';
import { getRoleColor, getRoleDisplayName } from '../../utils/roleUtils';

/**
 * Admin data table component with MUI DataGrid
 * Supports server-side pagination, sorting, filtering, and actions
 */
const AdminTable = ({
  rows = [],
  columns = [],
  loading = false,
  pagination = {},
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onFilterChange,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onDownload,
  title = 'Data Table',
  height = 400,
  showToolbar = true,
  showActions = true,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  // Default columns if none provided
  const defaultColumns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      type: 'number',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={params.row.avatar}
            sx={{ width: 32, height: 32 }}
          >
            {params.row.name?.charAt(0)}
          </Avatar>
          <Typography variant="body2">
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getRoleDisplayName(params.value)}
          size="small"
          sx={{
            backgroundColor: getRoleColor(params.value),
            color: 'white',
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'active' ? 'success' :
            params.value === 'inactive' ? 'error' : 'default'
          }
          variant="outlined"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      type: 'dateTime',
      valueFormatter: (params) => formatDate(params.value, 'short'),
      renderCell: (params) => (
        <Tooltip title={formatDate(params.value, 'long')}>
          <Typography variant="body2">
            {getRelativeTime(params.value)}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  // Action columns
  const actionColumns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        ...(onView ? [{
          icon: <ViewIcon />,
          label: 'View',
          onClick: () => onView(params.row),
        }] : []),
        ...(onEdit ? [{
          icon: <EditIcon />,
          label: 'Edit',
          onClick: () => onEdit(params.row),
        }] : []),
        ...(onDelete ? [{
          icon: <DeleteIcon />,
          label: 'Delete',
          onClick: () => onDelete(params.row),
        }] : []),
        ...(onDownload ? [{
          icon: <DownloadIcon />,
          label: 'Download',
          onClick: () => onDownload(params.row),
        }] : []),
      ].map((action, index) => (
        <GridActionsCellItem
          key={index}
          icon={action.icon}
          label={action.label}
          onClick={action.onClick}
        />
      )),
    },
  ];

  // Combine columns
  const tableColumns = useMemo(() => {
    const cols = columns.length > 0 ? columns : defaultColumns;
    return showActions ? [...cols, ...actionColumns] : cols;
  }, [columns, defaultColumns, showActions, onView, onEdit, onDelete, onDownload]);

  // Handle row selection
  const handleRowSelectionModelChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  // Handle pagination
  const handlePaginationModelChange = (model) => {
    if (onPageChange) {
      onPageChange(model.page + 1); // DataGrid is 0-based, API is 1-based
    }
    if (onPageSizeChange) {
      onPageSizeChange(model.pageSize);
    }
  };

  // Handle sorting
  const handleSortModelChange = (model) => {
    if (onSortChange && model.length > 0) {
      const sort = model[0];
      onSortChange({
        field: sort.field,
        sort: sort.sort,
      });
    }
  };

  // Handle filtering
  const handleFilterModelChange = (model) => {
    if (onFilterChange) {
      onFilterChange(model);
    }
  };

  return (
    <Box sx={{ height, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={tableColumns}
        loading={loading}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={{
          page: (pagination.page || 1) - 1, // Convert to 0-based
          pageSize: pagination.limit || 10,
        }}
        onPaginationModelChange={handlePaginationModelChange}
        onSortModelChange={handleSortModelChange}
        onFilterModelChange={handleFilterModelChange}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        onRowClick={(params) => onRowClick && onRowClick(params.row)}
        rowCount={pagination.total || 0}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        disableRowSelectionOnClick
        checkboxSelection
        disableColumnMenu={false}
        slots={{
          toolbar: showToolbar ? GridToolbar : null,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #e0e0e0',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      />
    </Box>
  );
};

export default AdminTable;
