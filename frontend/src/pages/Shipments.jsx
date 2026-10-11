import React, { useState, useRef } from 'react';
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
  Chip,
  Tooltip,
  IconButton,
  InputAdornment,
  MenuItem
} from '@mui/material';

const initialShipments = [
  { shipmentId: 1, storeId: 1, customerId: 101, deliveryAddress: '123 Market St, Springfield', shipmentStatus: 'PENDING' },
  { shipmentId: 2, storeId: 2, customerId: 102, deliveryAddress: '45 Elm Rd, Shelbyville', shipmentStatus: 'SHIPPED' },
  { shipmentId: 3, storeId: 3, customerId: 103, deliveryAddress: '89 Pine Ave, Ogdenville', shipmentStatus: 'DELIVERED' },
  { shipmentId: 4, storeId: 1, customerId: 104, deliveryAddress: '67 Oak Blvd, North Haverbrook', shipmentStatus: 'CANCELLED' },
  { shipmentId: 5, storeId: 4, customerId: 105, deliveryAddress: '501 Sunset Way, Capital City', shipmentStatus: 'PENDING' },
  { shipmentId: 6, storeId: 2, customerId: 106, deliveryAddress: '78 Cedar St, Springfield', shipmentStatus: 'DELIVERED' },
  { shipmentId: 7, storeId: 5, customerId: 107, deliveryAddress: '910 Maple Ct, Shelbyville', shipmentStatus: 'SHIPPED' },
  { shipmentId: 8, storeId: 3, customerId: 108, deliveryAddress: '12 Birch Pl, Ogdenville', shipmentStatus: 'PENDING' },
  { shipmentId: 9, storeId: 4, customerId: 109, deliveryAddress: '34 Walnut Dr, North Haverbrook', shipmentStatus: 'DELIVERED' },
  { shipmentId: 10, storeId: 6, customerId: 110, deliveryAddress: '77 Ash Loop, Capital City', shipmentStatus: 'PENDING' },
  { shipmentId: 11, storeId: 2, customerId: 111, deliveryAddress: '19 Poplar Sq, Springfield', shipmentStatus: 'SHIPPED' },
  { shipmentId: 12, storeId: 5, customerId: 112, deliveryAddress: '246 Chestnut Ln, Shelbyville', shipmentStatus: 'DELIVERED' },
  { shipmentId: 13, storeId: 6, customerId: 113, deliveryAddress: '135 Spruce Rd, Ogdenville', shipmentStatus: 'PENDING' },
  { shipmentId: 14, storeId: 1, customerId: 114, deliveryAddress: '400 Harbor Ave, North Haverbrook', shipmentStatus: 'SHIPPED' },
  { shipmentId: 15, storeId: 3, customerId: 115, deliveryAddress: '59 Ridge View, Capital City', shipmentStatus: 'DELIVERED' },
  { shipmentId: 16, storeId: 4, customerId: 116, deliveryAddress: '82 River Bend, Springfield', shipmentStatus: 'PENDING' },
  { shipmentId: 17, storeId: 5, customerId: 117, deliveryAddress: '93 Canyon Pass, Shelbyville', shipmentStatus: 'DELIVERED' },
  { shipmentId: 18, storeId: 6, customerId: 118, deliveryAddress: '741 Summit Dr, Ogdenville', shipmentStatus: 'SHIPPED' },
  { shipmentId: 19, storeId: 2, customerId: 119, deliveryAddress: '852 Valley Rd, North Haverbrook', shipmentStatus: 'PENDING' },
  { shipmentId: 20, storeId: 1, customerId: 120, deliveryAddress: '963 Lake Shore, Capital City', shipmentStatus: 'DELIVERED' },
];

const statusOptions = ['PENDING', 'SHIPPED', 'DELIVERED', 'OVERDUE', 'CANCELLED'];

export default function Shipments() {
  const [shipments, setShipments] = useState(initialShipments);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ storeId: '', customerId: '', deliveryAddress: '', shipmentStatus: 'PENDING' });
  const [editing, setEditing] = useState(null);
  const nextId = useRef(initialShipments.length + 1);

  // Status Metrics
  const totalCount = shipments.length;
  const pendingCount = shipments.filter(s => s.shipmentStatus === 'PENDING').length;
  const shippedCount = shipments.filter(s => s.shipmentStatus === 'SHIPPED').length;
  const deliveredCount = shipments.filter(s => s.shipmentStatus === 'DELIVERED').length;

  const handleOpen = (shipment = null) => {
    setEditing(shipment);
    setForm(
      shipment
        ? { ...shipment }
        : { storeId: '', customerId: '', deliveryAddress: '', shipmentStatus: 'PENDING' }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (editing) {
      setShipments((s) =>
        s.map((r) =>
          r.shipmentId === editing.shipmentId
            ? { ...r, ...form, storeId: Number(form.storeId), customerId: Number(form.customerId) }
            : r
        )
      );
    } else {
      const newRow = {
        shipmentId: nextId.current++,
        storeId: Number(form.storeId),
        customerId: Number(form.customerId),
        deliveryAddress: form.deliveryAddress,
        shipmentStatus: form.shipmentStatus || 'PENDING'
      };
      setShipments((s) => [...s, newRow]);
    }
    handleClose();
  };

  const handleDelete = (shipmentId) => {
    setShipments((s) => s.filter((r) => r.shipmentId !== shipmentId));
  };

  const getStatusBadge = (status = '') => {
    const s = String(status).toUpperCase();
    if (s === 'DELIVERED') return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', icon: '✅' };
    if (s === 'PENDING') return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', icon: '⏳' };
    if (s === 'SHIPPED') return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)', icon: '🚚' };
    if (s === 'OVERDUE') return { bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.3)', icon: '⚠️' };
    return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)', icon: '📦' };
  };

  const filteredShipments = shipments.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.deliveryAddress.toLowerCase().includes(q) ||
      item.shipmentStatus.toLowerCase().includes(q) ||
      String(item.shipmentId).includes(q) ||
      String(item.customerId).includes(q)
    );
  });

  const columns = [
    {
      field: 'shipmentId',
      headerName: 'ID',
      width: 90,
      renderCell: (params) => (
        <span style={{ color: '#818cf8', fontWeight: 700 }}>#{params.row.shipmentId}</span>
      )
    },
    {
      field: 'storeId',
      headerName: 'Store',
      width: 120,
      renderCell: (params) => (
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Store #{params.row.storeId}</span>
      )
    },
    {
      field: 'customerId',
      headerName: 'Customer',
      width: 130,
      renderCell: (params) => (
        <span style={{ color: '#cbd5e1' }}>Cust #{params.row.customerId}</span>
      )
    },
    {
      field: 'deliveryAddress',
      headerName: 'Delivery Destination',
      flex: 2,
      minWidth: 240,
      renderCell: (params) => (
        <span style={{ color: '#e2e8f0' }}>📍 {params.row.deliveryAddress}</span>
      )
    },
    {
      field: 'shipmentStatus',
      headerName: 'Fulfillment Status',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const badge = getStatusBadge(params.row.shipmentStatus);
        return (
          <Chip
            size="small"
            label={`${badge.icon} ${params.row.shipmentStatus}`}
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
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <Tooltip title="Edit Shipment">
            <IconButton
              size="small"
              onClick={() => handleOpen(params.row)}
              sx={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', '&:hover': { background: 'rgba(59,130,246,0.2)' } }}
            >
              ✏️
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Shipment">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.shipmentId)}
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
            <span>🚚</span> Shipment & Logistics Manager
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Monitor delivery pipelines, update transit stages, and audit carrier dispatches.
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
          ➕ Dispatch New Shipment
        </Button>
      </Box>

      {/* KPI Metrics Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
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
            Total Shipments
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
            {totalCount}
          </Typography>
          <Typography variant="caption" sx={{ color: '#38bdf8' }}>
            All active & historic parcels
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
            ⏳ Pending Dispatch
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fbbf24' }}>
            {pendingCount}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Awaiting carrier pick-up
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography variant="caption" sx={{ color: '#60a5fa', textTransform: 'uppercase', fontWeight: 600 }}>
            🚚 In Transit
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#60a5fa' }}>
            {shippedCount}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Active on fulfillment route
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
            ✅ Delivered
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#34d399' }}>
            {deliveredCount}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Verified customer receipt
          </Typography>
        </Paper>
      </Box>

      {/* Shipments Table Panel */}
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
            placeholder="Search shipments by address, ID, status..."
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
            label={`${filteredShipments.length} Records`}
            sx={{
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
              fontWeight: 600
            }}
          />
        </Box>

        <Box style={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={filteredShipments}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            getRowId={(row) => row.shipmentId}
            disableRowSelectionOnClick
          />
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
          {editing ? '✏️ Edit Shipment' : '➕ Dispatch New Shipment'}
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
              label="Customer ID"
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              type="number"
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Delivery Address"
              name="deliveryAddress"
              value={form.deliveryAddress}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              select
              label="Shipment Status"
              name="shipmentStatus"
              value={form.shipmentStatus}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            >
              {statusOptions.map((st) => (
                <MenuItem key={st} value={st} sx={{ color: '#0f172a', fontWeight: 600 }}>
                  {st}
                </MenuItem>
              ))}
            </TextField>
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
            Save Shipment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}