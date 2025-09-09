import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import api from '../api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ storeId: '', productId: '', productInventory: '' });
  const [editing, setEditing] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    const data = await api.get('/api/v1/inventory');
    setInventory(data);
    setLoading(false);
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleOpen = (item = null) => {
    setEditing(item);
    setForm(item ? { ...item } : { storeId: '', productId: '', productInventory: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const payload = { ...form, storeId: Number(form.storeId), productId: Number(form.productId), productInventory: Number(form.productInventory) };
    if (editing) {
      await api.put('/api/v1/inventory', { ...payload, inventoryId: editing.inventoryId });
    } else {
      await api.post('/api/v1/inventory', payload);
    }
    handleClose();
    fetchInventory();
  };

  const handleDelete = async (inventoryId) => {
    await api.delete(`/api/v1/inventory/${inventoryId}`);
    fetchInventory();
  };

  const columns = [
    { field: 'inventoryId', headerName: 'ID', width: 90 },
    { field: 'storeId', headerName: 'Store ID', flex: 1 },
    { field: 'productId', headerName: 'Product ID', flex: 1 },
    { field: 'productInventory', headerName: 'Inventory', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.row.inventoryId)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Inventory</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Add Inventory</Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={inventory} columns={columns} loading={loading} pageSize={5} rowsPerPageOptions={[5]} getRowId={row => row.inventoryId} />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Inventory' : 'Add Inventory'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField label="Store ID" name="storeId" value={form.storeId} onChange={handleChange} type="number" fullWidth />
          <TextField label="Product ID" name="productId" value={form.productId} onChange={handleChange} type="number" fullWidth />
          <TextField label="Inventory" name="productInventory" value={form.productInventory} onChange={handleChange} type="number" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
