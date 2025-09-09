import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ orderTms: '', customerId: '', orderStatus: '', storeId: '' });
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, orderId: null });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/v1/orders');
      setOrders(data);
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to fetch orders', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

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
    setForm(order ? {
      ...order,
      orderTms: order.orderTms ? new Date(order.orderTms).toISOString().slice(0, 16) : ''
    } : { orderTms: '', customerId: '', orderStatus: '', storeId: '' });
    setFormError({});
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); setFormError({}); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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
        setSnackbar({ open: true, message: 'Order updated', severity: 'success' });
      } else {
        await api.post('/api/v1/orders', payload);
        setSnackbar({ open: true, message: 'Order added', severity: 'success' });
      }
      handleClose();
      fetchOrders();
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to save order', severity: 'error' });
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

  const columns = [
    { field: 'orderId', headerName: 'ID', width: 90 },
    { field: 'orderTms', headerName: 'Order Time', flex: 1, valueGetter: (params) => params.row.orderTms ? new Date(params.row.orderTms).toLocaleString() : '' },
    { field: 'customerId', headerName: 'Customer ID', flex: 1 },
    { field: 'orderStatus', headerName: 'Status', flex: 1 },
    { field: 'storeId', headerName: 'Store ID', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => setDeleteDialog({ open: true, orderId: params.row.orderId })}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Orders</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Add Order</Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        {loading ? (
          <Box className="flex items-center justify-center h-full"><CircularProgress /></Box>
        ) : (
          <DataGrid rows={orders} columns={columns} pageSize={5} rowsPerPageOptions={[5]} getRowId={row => row.orderId} />
        )}
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Order' : 'Add Order'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField label="Order Time" name="orderTms" value={form.orderTms} onChange={handleChange} type="datetime-local" fullWidth error={!!formError.orderTms} helperText={formError.orderTms} />
          <TextField label="Customer ID" name="customerId" value={form.customerId} onChange={handleChange} type="number" fullWidth error={!!formError.customerId} helperText={formError.customerId} />
          <TextField label="Status" name="orderStatus" value={form.orderStatus} onChange={handleChange} fullWidth error={!!formError.orderStatus} helperText={formError.orderStatus} />
          <TextField label="Store ID" name="storeId" value={form.storeId} onChange={handleChange} type="number" fullWidth error={!!formError.storeId} helperText={formError.storeId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, orderId: null })}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>Are you sure you want to delete this order?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, orderId: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
