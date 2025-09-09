import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productName: '', unitPrice: '', colour: '', brand: '', size: '', rating: '', category: '' });
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.get('/api/v1/products');
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpen = (product = null) => {
    setEditing(product);
    setForm(product ? { ...product, unitPrice: product.unitPrice?.toString() ?? '' } : { productName: '', unitPrice: '', colour: '', brand: '', size: '', rating: '', category: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const payload = {
      ...form,
      productId: editing ? editing.productId : undefined,
      unitPrice: form.unitPrice ? parseFloat(form.unitPrice) : 0,
      rating: form.rating ? Number(form.rating) : 0
    };
    if (editing) {
      await api.put('/api/v1/products', payload);
    } else {
      await api.post('/api/v1/products', payload);
    }
    handleClose();
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    await api.delete(`/api/v1/products/${productId}`);
    fetchProducts();
  };

  const columns = [
    { field: 'productId', headerName: 'ID', width: 90 },
    { field: 'productName', headerName: 'Name', flex: 1 },
    { field: 'unitPrice', headerName: 'Unit Price', flex: 1 },
    { field: 'colour', headerName: 'Colour', flex: 1 },
    { field: 'brand', headerName: 'Brand', flex: 1 },
    { field: 'size', headerName: 'Size', flex: 1 },
    { field: 'rating', headerName: 'Rating', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.row.productId)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Add Product</Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={products} columns={columns} loading={loading} pageSize={5} rowsPerPageOptions={[5]} getRowId={row => row.productId} />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField label="Name" name="productName" value={form.productName} onChange={handleChange} fullWidth />
          <TextField label="Unit Price" name="unitPrice" value={form.unitPrice} onChange={handleChange} type="number" fullWidth />
          <TextField label="Colour" name="colour" value={form.colour} onChange={handleChange} fullWidth />
          <TextField label="Brand" name="brand" value={form.brand} onChange={handleChange} fullWidth />
          <TextField label="Size" name="size" value={form.size} onChange={handleChange} fullWidth />
          <TextField label="Rating" name="rating" value={form.rating} onChange={handleChange} type="number" fullWidth />
          <TextField label="Category" name="category" value={form.category} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
