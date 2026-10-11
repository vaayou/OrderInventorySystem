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

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ storeId: '', productId: '', productInventory: '' });
  const [editing, setEditing] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/v1/inventory');
      setInventory(Array.isArray(data) ? data : []);
    } catch {
      // fallback
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpen = (item = null) => {
    setEditing(item);
    setForm(item ? { ...item } : { storeId: '', productId: '', productInventory: '' });
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
      storeId: Number(form.storeId),
      productId: Number(form.productId),
      productInventory: Number(form.productInventory)
    };
    try {
      if (editing) {
        await api.put('/api/v1/inventory', { ...payload, inventoryId: editing.inventoryId });
      } else {
        await api.post('/api/v1/inventory', payload);
      }
      handleClose();
      fetchInventory();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (inventoryId) => {
    try {
      await api.delete(`/api/v1/inventory/${inventoryId}`);
      fetchInventory();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      String(item.inventoryId).includes(q) ||
      String(item.storeId).includes(q) ||
      String(item.productId).includes(q) ||
      String(item.productInventory).includes(q)
    );
  });

  const columns = [
    {
      field: 'inventoryId',
      headerName: 'ID',
      width: 90,
      renderCell: (params) => (
        <span style={{ color: '#818cf8', fontWeight: 700 }}>#{params.row.inventoryId}</span>
      )
    },
    {
      field: 'storeId',
      headerName: 'Store ID',
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Store #{params.row.storeId}</span>
      )
    },
    {
      field: 'productId',
      headerName: 'Product ID',
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Item #{params.row.productId}</span>
      )
    },
    {
      field: 'productInventory',
      headerName: 'Stock Level (Units)',
      flex: 1.5,
      renderCell: (params) => {
        const qty = Number(params.row.productInventory || 0);
        const isLow = qty < 20;
        const isOut = qty <= 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
            <span style={{ fontWeight: 800, color: isOut ? '#f87171' : isLow ? '#fbbf24' : '#34d399' }}>
              {qty} units
            </span>
            <Chip
              size="small"
              label={isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                background: isOut ? 'rgba(239,68,68,0.15)' : isLow ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                color: isOut ? '#f87171' : isLow ? '#fbbf24' : '#34d399',
                border: `1px solid ${isOut ? 'rgba(239,68,68,0.3)' : isLow ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`
              }}
            />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Tooltip title="Edit Inventory">
            <IconButton
              size="small"
              onClick={() => handleOpen(params.row)}
              sx={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', '&:hover': { background: 'rgba(59,130,246,0.2)' } }}
            >
              ✏️
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Entry">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.inventoryId)}
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
            <span>📦</span> Warehouse & Inventory Control
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Real-time multi-location warehouse stocks, shelf inventories, and threshold warnings.
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
          ➕ Stock Adjustment / Add
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
            placeholder="Search by ID, store, or product..."
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
            label={`${filteredInventory.length} Inventory Locations`}
            sx={{
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
              fontWeight: 600
            }}
          />
        </Box>

        <Box style={{ height: 500, width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
              <CircularProgress sx={{ color: '#6366f1' }} size={48} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>Querying warehouse inventory...</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredInventory}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20]}
              getRowId={(row) => row.inventoryId}
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
          {editing ? '✏️ Update Warehouse Inventory' : '➕ Add Inventory Allocation'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label="Store ID"
              name="storeId"
              value={form.storeId}
              onChange={handleChange}
              type="number"
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Product ID"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              type="number"
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Available Stock Quantity"
              name="productInventory"
              value={form.productInventory}
              onChange={handleChange}
              type="number"
              fullWidth
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
            Save Inventory
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
