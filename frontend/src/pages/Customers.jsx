import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import api from '../api';
import DataViewModal from '../components/DataViewModal';

export default function Customers() {
  // Core data
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CRUD dialog state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { fullName: '', emailAddress: '' };
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState({});

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({ open: false, customerId: null });

  // Search inputs
  const [searchEmail, setSearchEmail] = useState('');
  const [searchName, setSearchName] = useState('');

  // Quantity range
  const [quantityRange, setQuantityRange] = useState({ min: '', max: '' });

  // Dedicated Rich Modals (Replacing plain JSON!)
  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    type: 'generic', // 'stats', 'customers', 'orders', 'shipments', 'search'
    badgeIcon: '📋',
    data: null
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const notify = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/api/v1/customers');
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // CRUD handlers
  const handleOpen = (customer = null) => {
    setEditing(customer);
    setForm(customer ? { fullName: customer.fullName || '', emailAddress: customer.emailAddress || '' } : emptyForm);
    setFormError({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.emailAddress.trim()) errs.emailAddress = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.emailAddress)) errs.emailAddress = 'Invalid email format';
    setFormError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editing) {
        await api.put('/api/v1/customers', { ...editing, ...form, customerId: editing.customerId });
        notify('Customer updated successfully');
      } else {
        await api.post('/api/v1/customers', form);
        notify('Customer created successfully');
      }
      handleClose();
      fetchCustomers();
    } catch (e) {
      notify(e.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.customerId) return;
    try {
      await api.delete(`/api/v1/customers/${deleteDialog.customerId}`);
      notify('Customer removed');
      setDeleteDialog({ open: false, customerId: null });
      fetchCustomers();
    } catch (e) {
      notify(e.message || 'Delete operation failed', 'error');
    }
  };

  // Actions & Queries with Styled Views
  const handleSearchByEmail = async () => {
    if (!searchEmail.trim()) return notify('Please enter an email address', 'error');
    try {
      const data = await api.get(`/api/v1/customers/${encodeURIComponent(searchEmail.trim())}`);
      setModalState({
        open: true,
        title: `Search Result: ${searchEmail.trim()}`,
        type: 'search',
        badgeIcon: '🔍',
        data: data ? (Array.isArray(data) ? data : [data]) : []
      });
    } catch (e) {
      notify('No customer found for that email', 'error');
    }
  };

  const handleSearchByName = async () => {
    if (!searchName.trim()) return notify('Please enter a name to search', 'error');
    try {
      const data = await api.get(`/api/v1/customers/name/${encodeURIComponent(searchName.trim())}`);
      setModalState({
        open: true,
        title: `Search Results for "${searchName.trim()}"`,
        type: 'search',
        badgeIcon: '👤',
        data: Array.isArray(data) ? data : data ? [data] : []
      });
    } catch (e) {
      notify('No customer(s) found matching that name', 'error');
    }
  };

  // Shipment Stats Modal
  const handleShipmentStatusCount = async () => {
    try {
      const data = await api.get('/api/v1/customers/shipment/status');
      setModalState({
        open: true,
        title: 'Shipment Status Distribution & Analytics',
        type: 'stats',
        badgeIcon: '📊',
        data: Array.isArray(data) ? data : []
      });
    } catch (e) {
      notify('Failed to load shipment statistics', 'error');
    }
  };

  // Pending Shipments Modal
  const handlePendingShipments = async () => {
    try {
      const data = await api.get('/api/v1/customers/shipments/pending');
      setModalState({
        open: true,
        title: 'Customers with Pending Shipments',
        type: 'customers',
        badgeIcon: '⏳',
        data: Array.isArray(data) ? data : []
      });
    } catch (e) {
      notify('Failed to fetch pending shipments', 'error');
    }
  };

  // Completed Orders Modal
  const handleCompletedOrders = async () => {
    try {
      const data = await api.get('/api/v1/customers/orders/completed');
      setModalState({
        open: true,
        title: 'Customers with Completed Orders',
        type: 'customers',
        badgeIcon: '✅',
        data: Array.isArray(data) ? data : []
      });
    } catch (e) {
      notify('Failed to fetch completed orders', 'error');
    }
  };

  // Overdue Shipments Modal
  const handleOverdueShipments = async () => {
    try {
      const data = await api.get('/api/v1/customers/shipments/overdue');
      setModalState({
        open: true,
        title: 'Customers with Overdue Shipments (Urgent)',
        type: 'customers',
        badgeIcon: '⚠️',
        data: Array.isArray(data) ? data : []
      });
    } catch (e) {
      notify('Failed to fetch overdue shipments', 'error');
    }
  };

  // Filter by quantity range
  const handleOrderQuantityRange = async () => {
    const min = parseInt(quantityRange.min, 10);
    const max = parseInt(quantityRange.max, 10);
    if (Number.isNaN(min) || Number.isNaN(max)) return notify('Please provide both min and max order quantities', 'error');
    try {
      const data = await api.get(`/api/v1/customers/orders/quantity/${min}/${max}`);
      setModalState({
        open: true,
        title: `Customers with Orders between ${min} and ${max}`,
        type: 'customers',
        badgeIcon: '📦',
        data: Array.isArray(data) ? data : []
      });
    } catch (e) {
      notify('Failed to fetch customers by order range', 'error');
    }
  };

  // View individual customer's orders
  const handleViewOrders = async (id) => {
    try {
      const data = await api.get(`/api/v1/customers/${id}/order`);
      setModalState({
        open: true,
        title: `Customer Order Log`,
        type: 'orders',
        badgeIcon: '📋',
        data
      });
    } catch (e) {
      notify('Failed to load orders for this customer', 'error');
    }
  };

  // View individual customer's shipments
  const handleViewShipments = async (id) => {
    try {
      const data = await api.get(`/api/v1/customers/${id}/shipment`);
      setModalState({
        open: true,
        title: `Customer Shipment History`,
        type: 'shipments',
        badgeIcon: '🚚',
        data
      });
    } catch (e) {
      notify('Failed to load shipments for this customer', 'error');
    }
  };

  const columns = [
    {
      field: 'customerId',
      headerName: 'ID',
      width: 90,
      renderCell: (params) => (
        <span style={{ color: '#818cf8', fontWeight: 700 }}>#{params.row.customerId}</span>
      )
    },
    {
      field: 'fullName',
      headerName: 'Customer Name',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => {
        const initials = (params.row.fullName || 'C')
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)'
              }}
            >
              {initials}
            </Avatar>
            <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>
              {params.row.fullName}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'emailAddress',
      headerName: 'Email Address',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <span style={{ color: '#cbd5e1' }}>{params.row.emailAddress}</span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}>
          <Tooltip title="View Orders">
            <IconButton
              size="small"
              onClick={() => handleViewOrders(params.row.customerId)}
              sx={{
                color: '#34d399',
                background: 'rgba(16,185,129,0.1)',
                '&:hover': { background: 'rgba(16,185,129,0.2)' }
              }}
            >
              📋
            </IconButton>
          </Tooltip>
          <Tooltip title="View Shipments">
            <IconButton
              size="small"
              onClick={() => handleViewShipments(params.row.customerId)}
              sx={{
                color: '#fbbf24',
                background: 'rgba(245,158,11,0.1)',
                '&:hover': { background: 'rgba(245,158,11,0.2)' }
              }}
            >
              🚚
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Customer">
            <IconButton
              size="small"
              onClick={() => handleOpen(params.row)}
              sx={{
                color: '#60a5fa',
                background: 'rgba(59,130,246,0.1)',
                '&:hover': { background: 'rgba(59,130,246,0.2)' }
              }}
            >
              ✏️
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton
              size="small"
              onClick={() => setDeleteDialog({ open: true, customerId: params.row.customerId })}
              sx={{
                color: '#f87171',
                background: 'rgba(239,68,68,0.1)',
                '&:hover': { background: 'rgba(239,68,68,0.2)' }
              }}
            >
              🗑️
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <span>👥</span> Customer Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Access customer accounts, audit order streams, track shipment lifecycles & analyze real-time states.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            py: 1.25,
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)'
            }
          }}
        >
          ➕ Add Customer
        </Button>
      </Box>

      {/* Quick Action Intelligence Cards */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
              Operational Quick Actions
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Instant reports for logistics, fulfillment status and pending delivery workflows
            </Typography>
          </Box>
          <Chip
            size="small"
            label="Live Data"
            sx={{
              background: 'rgba(16,185,129,0.15)',
              color: '#34d399',
              border: '1px solid rgba(16,185,129,0.3)',
              fontWeight: 700
            }}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleShipmentStatusCount}
            sx={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.25,
              boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4)' }
            }}
          >
            📊 Shipment Stats
          </Button>

          <Button
            variant="contained"
            onClick={handlePendingShipments}
            sx={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.25,
              boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)' }
            }}
          >
            ⏳ Pending Shipments
          </Button>

          <Button
            variant="contained"
            onClick={handleCompletedOrders}
            sx={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.25,
              boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(5, 150, 105, 0.4)' }
            }}
          >
            ✅ Completed Orders
          </Button>

          <Button
            variant="contained"
            onClick={handleOverdueShipments}
            sx={{
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.25,
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.35)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(225, 29, 72, 0.45)' }
            }}
          >
            ⚠️ Overdue Shipments
          </Button>
        </Stack>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />

        {/* Filter by Order Quantity Range */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            Order Volume Query:
          </Typography>
          <TextField
            placeholder="Min Orders"
            value={quantityRange.min}
            onChange={(e) => setQuantityRange((q) => ({ ...q, min: e.target.value }))}
            size="small"
            type="number"
            sx={{
              width: 120,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              '& .MuiInputBase-input': { color: 'white' }
            }}
          />
          <TextField
            placeholder="Max Orders"
            value={quantityRange.max}
            onChange={(e) => setQuantityRange((q) => ({ ...q, max: e.target.value }))}
            size="small"
            type="number"
            sx={{
              width: 120,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              '& .MuiInputBase-input': { color: 'white' }
            }}
          />
          <Button
            variant="outlined"
            onClick={handleOrderQuantityRange}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              color: '#38bdf8',
              borderColor: 'rgba(56, 189, 248, 0.4)',
              '&:hover': { borderColor: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }
            }}
          >
            Filter by Order Count
          </Button>
        </Box>
      </Paper>

      {/* Search Bar Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
          Customer Directory Lookup
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          {/* Email Search */}
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: '50%' } }}>
            <TextField
              placeholder="Search by exact email address..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              size="small"
              fullWidth
              sx={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '10px',
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchByEmail}
              sx={{
                background: 'rgba(99, 102, 241, 0.8)',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                '&:hover': { background: '#6366f1' }
              }}
            >
              Search
            </Button>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)', display: { xs: 'none', md: 'block' } }} />

          {/* Name Search */}
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: '50%' } }}>
            <TextField
              placeholder="Search by customer name pattern..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              size="small"
              fullWidth
              sx={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '10px',
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchByName}
              sx={{
                background: 'rgba(99, 102, 241, 0.8)',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                '&:hover': { background: '#6366f1' }
              }}
            >
              Search
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Customers DataGrid */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          p: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
              All Customers Records
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Showing {customers.length} registered customers in database
            </Typography>
          </Box>

          <Button
            size="small"
            onClick={fetchCustomers}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              color: '#94a3b8',
              borderColor: 'rgba(255,255,255,0.15)',
              textTransform: 'none',
              '&:hover': { color: 'white', borderColor: 'white' }
            }}
          >
            🔄 Refresh
          </Button>
        </Box>

        <Box style={{ height: 560, width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
              <CircularProgress sx={{ color: '#6366f1' }} size={48} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>Connecting to customer database...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: '#f87171', fontWeight: 600, mb: 2 }}>{error}</Typography>
              <Button variant="outlined" onClick={fetchCustomers} sx={{ color: '#60a5fa', borderColor: '#60a5fa' }}>
                Try Again
              </Button>
            </Box>
          ) : (
            <DataGrid
              rows={customers}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[10, 15, 25, 50]}
              getRowId={(row) => row.customerId}
              disableRowSelectionOnClick
            />
          )}
        </Box>
      </Paper>

      {/* Add / Edit Customer Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
          {editing ? '✏️ Edit Customer Profile' : '➕ Create New Customer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              autoFocus
              fullWidth
              error={!!formError.fullName}
              helperText={formError.fullName}
              sx={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
            <TextField
              label="Email Address"
              name="emailAddress"
              value={form.emailAddress}
              onChange={handleChange}
              fullWidth
              error={!!formError.emailAddress}
              helperText={formError.emailAddress}
              sx={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3
            }}
          >
            Save Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, customerId: null })}
        PaperProps={{
          sx: {
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ color: '#fb7185', fontWeight: 700 }}>
          Confirm Customer Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1' }}>
            Are you sure you want to permanently delete customer #{deleteDialog.customerId}? This action cannot be reverted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, customerId: null })} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Interactive Rich View Modal (Replaces ALL raw JSON output!) */}
      <DataViewModal
        open={modalState.open}
        onClose={() => setModalState((m) => ({ ...m, open: false }))}
        title={modalState.title}
        type={modalState.type}
        badgeIcon={modalState.badgeIcon}
        data={modalState.data}
        onViewOrders={(id) => handleViewOrders(id)}
        onViewShipments={(id) => handleViewShipments(id)}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{
            background: snackbar.severity === 'success' ? '#059669' : '#dc2626',
            color: 'white',
            borderRadius: '12px',
            fontWeight: 600,
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
