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
  Grid,
  Paper,
  Stack,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import api from '../api';

/* -------------------------------------------------------------
   Customers Page
   Features:
   - List customers
   - Create / Update / Delete
   - Search by email & name
   - Fetch shipment status counts
   - View customer orders / shipments
   - Pending, Completed, Overdue, Quantity range queries
---------------------------------------------------------------- */

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

  // Generic result dialogs
  const [searchDialog, setSearchDialog] = useState({ open: false, title: '', data: null });
  const [statsDialog, setStatsDialog] = useState({ open: false, title: '', data: null });
  const [orderDialog, setOrderDialog] = useState({ open: false, data: null });
  const [shipmentDialog, setShipmentDialog] = useState({ open: false, data: null });
  const [pendingDialog, setPendingDialog] = useState({ open: false, data: null });
  const [completedDialog, setCompletedDialog] = useState({ open: false, data: null });
  const [overdueDialog, setOverdueDialog] = useState({ open: false, data: null });
  const [quantityDialog, setQuantityDialog] = useState({ open: false, data: null });

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

  useEffect(() => { fetchCustomers(); }, []);

  // CRUD handlers
  const handleOpen = (customer = null) => {
    setEditing(customer);
    setForm(customer ? { fullName: customer.fullName || '', emailAddress: customer.emailAddress || '' } : emptyForm);
    setFormError({});
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name required';
    if (!form.emailAddress.trim()) errs.emailAddress = 'Email required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.emailAddress)) errs.emailAddress = 'Invalid email';
    setFormError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editing) {
        await api.put('/api/v1/customers', { ...editing, ...form, customerId: editing.customerId });
        notify('Customer updated');
      } else {
        await api.post('/api/v1/customers', form);
        notify('Customer created');
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
      notify('Customer deleted');
      setDeleteDialog({ open: false, customerId: null });
      fetchCustomers();
    } catch (e) {
      notify(e.message || 'Delete failed', 'error');
    }
  };

  // Search & actions
  const handleSearchByEmail = async () => {
    if (!searchEmail.trim()) return notify('Enter email', 'error');
    try {
      const data = await api.get(`/api/v1/customers/${encodeURIComponent(searchEmail.trim())}`);
      setSearchDialog({ open: true, title: 'Search by Email', data });
    } catch (e) {
      notify('No customer for that email', 'error');
    }
  };

  const handleSearchByName = async () => {
    if (!searchName.trim()) return notify('Enter name', 'error');
    try {
      const data = await api.get(`/api/v1/customers/name/${encodeURIComponent(searchName.trim())}`);
      setSearchDialog({ open: true, title: 'Search by Name', data });
    } catch (e) {
      notify('No customer(s) for that name', 'error');
    }
  };

  const handleShipmentStatusCount = async () => {
    try {
      const data = await api.get('/api/v1/customers/shipment/status');
      setStatsDialog({ open: true, title: 'Shipment Status Count', data });
    } catch (e) { notify('Failed to fetch stats', 'error'); }
  };

  const handleViewOrders = async (id) => {
    try { setOrderDialog({ open: true, data: await api.get(`/api/v1/customers/${id}/order`) }); }
    catch { notify('Failed to fetch orders', 'error'); }
  };
  const handleViewShipments = async (id) => {
    try { setShipmentDialog({ open: true, data: await api.get(`/api/v1/customers/${id}/shipment`) }); }
    catch { notify('Failed to fetch shipments', 'error'); }
  };
  const handlePendingShipments = async () => {
    try { setPendingDialog({ open: true, data: await api.get('/api/v1/customers/shipments/pending') }); }
    catch { notify('Failed to fetch pending shipments', 'error'); }
  };
  const handleCompletedOrders = async () => {
    try { setCompletedDialog({ open: true, data: await api.get('/api/v1/customers/orders/completed') }); }
    catch { notify('Failed to fetch completed orders', 'error'); }
  };
  const handleOverdueShipments = async () => {
    try { setOverdueDialog({ open: true, data: await api.get('/api/v1/customers/shipments/overdue') }); }
    catch { notify('Failed to fetch overdue shipments', 'error'); }
  };
  const handleOrderQuantityRange = async () => {
    const min = parseInt(quantityRange.min, 10);
    const max = parseInt(quantityRange.max, 10);
    if (Number.isNaN(min) || Number.isNaN(max)) return notify('Enter min & max', 'error');
    try { setQuantityDialog({ open: true, data: await api.get(`/api/v1/customers/orders/quantity/${min}/${max}`) }); }
    catch { notify('Failed to fetch range', 'error'); }
  };

  const columns = [
    { field: 'customerId', headerName: 'ID', width: 90, headerClassName: 'text-white font-bold', cellClassName: 'text-white' },
    { field: 'fullName', headerName: 'Full Name', flex: 1, headerClassName: 'text-white font-bold', cellClassName: 'text-white' },
    { field: 'emailAddress', headerName: 'Email Address', flex: 1, headerClassName: 'text-white font-bold', cellClassName: 'text-white' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      headerClassName: 'text-white font-bold',
      renderCell: (params) => (
        <div className="flex gap-1">
          <Tooltip title="Edit"><IconButton size="small" sx={{ color: '#3b82f6' }} onClick={() => handleOpen(params.row)}>✏️</IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => setDeleteDialog({ open: true, customerId: params.row.customerId })}>🗑️</IconButton></Tooltip>
          <Tooltip title="View Orders"><IconButton size="small" sx={{ color: '#10b981' }} onClick={() => handleViewOrders(params.row.customerId)}>📋</IconButton></Tooltip>
          <Tooltip title="View Shipments"><IconButton size="small" sx={{ color: '#f59e0b' }} onClick={() => handleViewShipments(params.row.customerId)}>🚚</IconButton></Tooltip>
        </div>
      )
    }
  ];

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #0f172a 100%)', minHeight: '100vh', p: 5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', textShadow: '0 4px 8px rgba(156, 29, 29, 0.3)', letterSpacing: '0.5px' }}>Customer Management</Typography>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ background: 'linear-gradient(45deg, #06b6d4, #6366f1)', borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 3, py: 1.5, boxShadow: '0 8px 25px rgba(236, 236, 236, 0.4)', '&:hover': { background: 'linear-gradient(45deg, #2563eb, #4f46e5)', transform: 'translateY(-1px)' } }}>➕ Add Customer</Button>
      </Box>

      {/* Search & Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={12}>
          <Paper elevation={2} sx={{ background: 'rgba(250, 250, 250, 0.07)', borderRadius: '16px', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>Search & Filters</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
              <TextField label="Search Email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} size="small" sx={{ minWidth: 180 }} />
              <Button variant="outlined" onClick={handleSearchByEmail} sx={{ borderRadius: '8px', textTransform: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Search</Button>
              <TextField label="Search Name" value={searchName} onChange={e => setSearchName(e.target.value)} size="small" sx={{ minWidth: 180 }} />
              <Button variant="outlined" onClick={handleSearchByName} sx={{ borderRadius: '8px', textTransform: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Search</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={12}>
          <Paper elevation={2} sx={{ background: 'rgba(255,255,255,0.07)', borderRadius: '16px', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700 }}>Quick Actions</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
              <Button variant="contained" onClick={handleShipmentStatusCount} sx={{ background: 'linear-gradient(45deg, #06b6d4, #0891b2)', borderRadius: '10px', textTransform: 'none' }}>📊 Shipment Stats</Button>
              <Button variant="contained" onClick={handlePendingShipments} sx={{ background: 'linear-gradient(45deg, #f59e0b, #d97706)', borderRadius: '10px', textTransform: 'none' }}>⏳ Pending Shipments</Button>
              <Button variant="contained" onClick={handleCompletedOrders} sx={{ background: 'linear-gradient(45deg, #10b981, #059669)', borderRadius: '10px', textTransform: 'none' }}>✅ Completed Orders</Button>
              <Button variant="contained" onClick={handleOverdueShipments} sx={{ background: 'linear-gradient(45deg, #ef4444, #dc2626)', borderRadius: '10px', textTransform: 'none' }}>⚠️ Overdue Shipments</Button>
            </Stack>
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="end">
              <TextField label="Min Orders" value={quantityRange.min} onChange={e => setQuantityRange(q => ({ ...q, min: e.target.value }))} size="small" type="number" sx={{ width: 120 }} />
              <TextField label="Max Orders" value={quantityRange.max} onChange={e => setQuantityRange(q => ({ ...q, max: e.target.value }))} size="small" type="number" sx={{ width: 120 }} />
              <Button variant="outlined" onClick={handleOrderQuantityRange} sx={{ borderRadius: '8px', textTransform: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Filter by Order Qty</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <Grid container spacing={2} sx={{ minHeight: '95vh', py: 2 }}>
        <Grid size={12}>
          <Paper elevation={2} sx={{ background: 'rgba(255,255,255,0.07)', borderRadius: '16px', p: 3, minHeight: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 700, textAlign: 'center' }}>Customer Database</Typography>
            {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}><CircularProgress sx={{ color: '#3b82f6' }} size={60} /></Box>
          ) : error ? (
            <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography>
          ) : (
            <DataGrid
              rows={customers}
              columns={columns}
              pageSize={20}
              rowsPerPageOptions={[20]}
              getRowId={row => row.customerId}
              sx={{
            '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': { color: 'white' },
            border: 'none',
            '& .MuiDataGrid-cell': { borderColor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 500, fontFamily: 'Inter, sans-serif', fontSize: '1rem', letterSpacing: '0.01em', background: 'rgba(30,41,59,0.7)', backdropFilter: 'blur(2px)' },
            '& .MuiDataGrid-columnHeader': { background: 'linear-gradient(90deg, #06b6d4 0%, #a855f7 100%)', color: 'white', fontWeight: 700, fontSize: '1.1rem', textShadow: '0 2px 8px rgba(168,85,247,0.15)' },
            '& .MuiDataGrid-row': { backgroundColor: 'rgba(255,255,255,0.02)', '&:hover': { backgroundColor: 'rgba(99,102,241,0.08)' } },
            '& .MuiDataGrid-footerContainer': { borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
            '& .MuiTablePagination-root': { color: 'white' },
            '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.7)' },
            '& .Mui-disabled': { color: 'rgba(255,255,255,0.3)' }
              }}
            />
          )}
            </Paper>
          </Grid>
        </Grid>

        {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>{editing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} autoFocus fullWidth error={!!formError.fullName} helperText={formError.fullName} sx={{ mt: 2 }} />
          <TextField label="Email Address" name="emailAddress" value={form.emailAddress} onChange={handleChange} fullWidth error={!!formError.emailAddress} helperText={formError.emailAddress} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ background: 'linear-gradient(45deg, #3b82f6, #6366f1)', borderRadius: '8px', textTransform: 'none' }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, customerId: null })} PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>Delete Customer</DialogTitle>
        <DialogContent><Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>Are you sure you want to delete this customer? This action cannot be undone.</Typography></DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog({ open: false, customerId: null })} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ background: 'linear-gradient(45deg, #ef4444, #dc2626)', borderRadius: '8px', textTransform: 'none' }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Reusable data dialogs */}
      {([
        { state: orderDialog, set: setOrderDialog, title: 'Customer Orders' },
        { state: shipmentDialog, set: setShipmentDialog, title: 'Customer Shipments' },
        { state: pendingDialog, set: setPendingDialog, title: 'Customers with Pending Shipments' },
        { state: completedDialog, set: setCompletedDialog, title: 'Customers with Completed Orders' },
        { state: overdueDialog, set: setOverdueDialog, title: 'Customers with Overdue Shipments' },
        { state: quantityDialog, set: setQuantityDialog, title: 'Customers by Order Quantity Range' }
      ]).map((d, i) => (
        <Dialog key={i} open={d.state.open} onClose={() => d.set({ open: false, data: null })} maxWidth="md" fullWidth PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
          <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>{d.title}</DialogTitle>
          <DialogContent>
            <Box sx={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', p: 2, fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', maxHeight: '400px', overflow: 'auto' }}>
              {d.state.data ? JSON.stringify(d.state.data, null, 2) : 'No data'}
            </Box>
          </DialogContent>
          <DialogActions><Button onClick={() => d.set({ open: false, data: null })} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Close</Button></DialogActions>
        </Dialog>
      ))}

      {/* Search Results Dialog */}
      <Dialog open={searchDialog.open} onClose={() => setSearchDialog({ open: false, title: '', data: null })} maxWidth="md" fullWidth PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>{searchDialog.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', p: 2, fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', maxHeight: '400px', overflow: 'auto' }}>
            {searchDialog.data ? JSON.stringify(searchDialog.data, null, 2) : 'No results'}
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={() => setSearchDialog({ open: false, title: '', data: null })} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Close</Button></DialogActions>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={statsDialog.open} onClose={() => setStatsDialog({ open: false, title: '', data: null })} maxWidth="xs" fullWidth PaperProps={{ sx: { background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>{statsDialog.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', p: 2, fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
            {statsDialog.data ? JSON.stringify(statsDialog.data, null, 2) : 'No data'}
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={() => setStatsDialog({ open: false, title: '', data: null })} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Close</Button></DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ background: snackbar.severity === 'success' ? 'linear-gradient(45deg, #10b981, #059669)' : 'linear-gradient(45deg, #ef4444, #dc2626)', color: 'white', borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
