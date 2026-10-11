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
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  MenuItem,
  InputAdornment
} from '@mui/material';
import api from '../api';

const orderStatusList = ['PENDING', 'PROCESSING', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ orderTms: '', customerId: '', orderStatus: 'PENDING', storeId: '' });
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, orderId: null });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/v1/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to fetch orders from server', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const validate = () => {
    const errors = {};
    if (!form.orderTms) errors.orderTms = 'Order Time is required';
    if (!form.customerId) errors.customerId = 'Customer ID is required';
    if (!form.orderStatus.trim()) errors.orderStatus = 'Order Status is required';
    if (!form.storeId) errors.storeId = 'Store ID is required';
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpen = (order = null) => {
    setEditing(order);
    setForm(
      order
        ? {
            ...order,
            orderTms: order.orderTms ? new Date(order.orderTms).toISOString().slice(0, 16) : ''
          }
        : {
            orderTms: new Date().toISOString().slice(0, 16),
            customerId: '',
            orderStatus: 'PENDING',
            storeId: ''
          }
    );
    setFormError({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setFormError({});
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      ...form,
      orderId: editing ? editing.orderId : undefined,
      customerId: Number(form.customerId),
      storeId: Number(form.storeId),
      orderTms: form.orderTms ? new Date(form.orderTms).toISOString() : null
    };
    try {
      if (editing) {
        await api.put('/api/v1/orders', payload);
        setSnackbar({ open: true, message: 'Order record updated successfully', severity: 'success' });
      } else {
        await api.post('/api/v1/orders', payload);
        setSnackbar({ open: true, message: 'New order created successfully', severity: 'success' });
      }
      handleClose();
      fetchOrders();
    } catch (e) {
      setSnackbar({ open: true, message: 'Operation failed to process order', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/v1/orders/${deleteDialog.orderId}`);
      setSnackbar({ open: true, message: 'Order deleted', severity: 'success' });
      setDeleteDialog({ open: false, orderId: null });
      fetchOrders();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to delete order', severity: 'error' });
    }
  };

  const getOrderStatusBadge = (status = '') => {
    const s = String(status).toUpperCase();
    if (s.includes('DELIVER') || s.includes('COMPLET')) {
      return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', icon: '✅' };
    }
    if (s.includes('PEND')) {
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', icon: '⏳' };
    }
    if (s.includes('PROCESS')) {
      return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)', icon: '⚙️' };
    }
    if (s.includes('CANCEL')) {
      return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)', icon: '❌' };
    }
    return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)', icon: '📦' };
  };

  // Metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => ['DELIVERED', 'COMPLETED'].includes(String(o.orderStatus).toUpperCase())).length;
  const pendingOrders = orders.filter((o) => ['PENDING', 'PROCESSING'].includes(String(o.orderStatus).toUpperCase())).length;

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      String(o.orderId).includes(q) ||
      String(o.customerId).includes(q) ||
      String(o.storeId).includes(q) ||
      String(o.orderStatus).toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      field: 'orderId',
      headerName: 'Order ID',
      width: 100,
      renderCell: (params) => (
        <span style={{ color: '#818cf8', fontWeight: 700 }}>#{params.row.orderId}</span>
      )
    },
    {
      field: 'orderTms',
      headerName: 'Order Timestamp',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <span style={{ color: '#cbd5e1' }}>
          {params.row.orderTms ? new Date(params.row.orderTms).toLocaleString() : 'N/A'}
        </span>
      )
    },
    {
      field: 'customerId',
      headerName: 'Customer ID',
      width: 130,
      renderCell: (params) => (
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Cust #{params.row.customerId}</span>
      )
    },
    {
      field: 'orderStatus',
      headerName: 'Order Status',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const badge = getOrderStatusBadge(params.row.orderStatus);
        return (
          <Chip
            size="small"
            label={`${badge.icon} ${params.row.orderStatus}`}
            sx={{
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
              fontWeight: 700,
              fontSize: '0.75rem'
            }}
          />
        );
      }
    },
    {
      field: 'storeId',
      headerName: 'Store ID',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: '#94a3b8' }}>Store #{params.row.storeId}</span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Tooltip title="Edit Order">
            <IconButton
              size="small"
              onClick={() => handleOpen(params.row)}
              sx={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', '&:hover': { background: 'rgba(59,130,246,0.2)' } }}
            >
              ✏️
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Order">
            <IconButton
              size="small"
              onClick={() => setDeleteDialog({ open: true, orderId: params.row.orderId })}
              sx={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', '&:hover': { background: 'rgba(239,68,68,0.2)' } }}
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
      {/* Header */}
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
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span>📋</span> Orders Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Track sales transactions, fulfillments, retail checkouts and status progressions.
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
            '&:hover': { background: 'linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)', transform: 'translateY(-2px)' }
          }}
        >
          ➕ Create New Order
        </Button>
      </Box>

      {/* KPI Metrics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2.5
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Orders
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
            {totalOrders}
          </Typography>
          <Typography variant="caption" sx={{ color: '#38bdf8' }}>
            Registered store orders
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography variant="caption" sx={{ color: '#fbbf24', textTransform: 'uppercase', fontWeight: 600 }}>
            ⏳ Pending / In-Process
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fbbf24' }}>
            {pendingOrders}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Orders needing fulfillment
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography variant="caption" sx={{ color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>
            ✅ Completed Orders
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#34d399' }}>
            {completedOrders}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Fully delivered transactions
          </Typography>
        </Paper>
      </Box>

      {/* Orders Table Panel */}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Search orders by ID, customer, store, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: { xs: '100%', sm: 350 },
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              '& .MuiInputBase-input': { color: 'white' }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>
            }}
          />

          <Button
            size="small"
            onClick={fetchOrders}
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

        <Box style={{ height: 500, width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
              <CircularProgress sx={{ color: '#6366f1' }} size={48} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading orders registry...</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20]}
              getRowId={(row) => row.orderId}
              disableRowSelectionOnClick
            />
          )}
        </Box>
      </Paper>

      {/* Add / Edit Dialog */}
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
        <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>
          {editing ? '✏️ Edit Order' : '➕ Create New Order'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label="Order Timestamp"
              name="orderTms"
              value={form.orderTms}
              onChange={handleChange}
              type="datetime-local"
              fullWidth
              error={!!formError.orderTms}
              helperText={formError.orderTms}
              InputLabelProps={{ shrink: true }}
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Customer ID"
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              type="number"
              fullWidth
              error={!!formError.customerId}
              helperText={formError.customerId}
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              select
              label="Order Status"
              name="orderStatus"
              value={form.orderStatus}
              onChange={handleChange}
              fullWidth
              error={!!formError.orderStatus}
              helperText={formError.orderStatus}
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            >
              {orderStatusList.map((st) => (
                <MenuItem key={st} value={st} sx={{ color: '#0f172a', fontWeight: 600 }}>
                  {st}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Store ID"
              name="storeId"
              value={form.storeId}
              onChange={handleChange}
              type="number"
              fullWidth
              error={!!formError.storeId}
              helperText={formError.storeId}
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
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
            Save Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, orderId: null })}
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
          Delete Order
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1' }}>
            Are you sure you want to delete order #{deleteDialog.orderId}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, orderId: null })} sx={{ color: '#94a3b8' }}>
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
