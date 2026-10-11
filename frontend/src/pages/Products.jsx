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
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    productName: '',
    unitPrice: '',
    colour: '',
    brand: '',
    size: '',
    rating: '',
    category: ''
  });
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/v1/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      // fallback
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product = null) => {
    setEditing(product);
    setForm(
      product
        ? { ...product, unitPrice: product.unitPrice?.toString() ?? '' }
        : { productName: '', unitPrice: '', colour: '', brand: '', size: '', rating: '5', category: '' }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const payload = {
      ...form,
      productId: editing ? editing.productId : undefined,
      unitPrice: form.unitPrice ? parseFloat(form.unitPrice) : 0,
      rating: form.rating ? Number(form.rating) : 0
    };
    try {
      if (editing) {
        await api.put('/api/v1/products', payload);
      } else {
        await api.post('/api/v1/products', payload);
      }
      handleClose();
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/api/v1/products/${productId}`);
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.productName || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      String(p.productId).includes(q)
    );
  });

  const columns = [
    {
      field: 'productId',
      headerName: 'ID',
      width: 80,
      renderCell: (params) => (
        <span style={{ color: '#818cf8', fontWeight: 700 }}>#{params.row.productId}</span>
      )
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <span style={{ color: 'white', fontWeight: 600 }}>{params.row.productName}</span>
      )
    },
    {
      field: 'unitPrice',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: '#34d399', fontWeight: 700 }}>
          ${Number(params.row.unitPrice || 0).toFixed(2)}
        </span>
      )
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.category || 'General'}
          sx={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 600 }}
        />
      )
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: '#cbd5e1' }}>{params.row.brand || '—'}</span>
      )
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 110,
      renderCell: (params) => (
        <Chip
          size="small"
          label={`⭐ ${params.row.rating || 0}`}
          sx={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontWeight: 700 }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Tooltip title="Edit Product">
            <IconButton
              size="small"
              onClick={() => handleOpen(params.row)}
              sx={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', '&:hover': { background: 'rgba(59,130,246,0.2)' } }}
            >
              ✏️
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.productId)}
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
            <span>🏷️</span> Products Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Manage inventory item metadata, pricing matrices, SKUs, and categorization.
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
          ➕ Add New Product
        </Button>
      </Box>

      {/* Main Table Panel */}
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
            placeholder="Search products by name, brand, category..."
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

          <Chip
            label={`${filteredProducts.length} Items Listed`}
            sx={{
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
              fontWeight: 600
            }}
          />
        </Box>

        <Box style={{ height: 520, width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
              <CircularProgress sx={{ color: '#6366f1' }} size={48} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading product catalog...</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredProducts}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20]}
              getRowId={(row) => row.productId}
              disableRowSelectionOnClick
              sx={{
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeadersInner, & .MuiDataGrid-container--top, & .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-filler': {
                  background: 'linear-gradient(90deg, #1e1b4b 0%, #1e293b 50%, #0f172a 100%) !important',
                  backgroundColor: '#1e293b !important',
                  borderBottom: '2px solid rgba(99, 102, 241, 0.4) !important',
                  color: '#38bdf8 !important',
                },
                '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-columnHeaderTitleContainer': {
                  color: '#38bdf8 !important',
                  fontWeight: '800 !important',
                  letterSpacing: '0.05em !important',
                },
                '& .MuiDataGrid-cell': {
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#f8fafc',
                  background: 'transparent',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.12) !important',
                },
                '& .MuiDataGrid-footerContainer': {
                  background: '#0f172a',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                },
                '& .MuiTablePagination-root': {
                  color: '#94a3b8',
                },
                '& .MuiIconButton-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
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
          {editing ? '✏️ Edit Product' : '➕ Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Unit Price ($)"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              type="number"
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Colour"
                name="colour"
                value={form.colour}
                onChange={handleChange}
                fullWidth
                sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
              />
              <TextField
                label="Rating (1-5)"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                type="number"
                fullWidth
                sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
              />
            </Box>
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
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
