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
  IconButton,
  Tooltip,
  Chip,
  InputAdornment
} from '@mui/material';

const initialStores = [
  { storeId: 1,  storeName: 'Futurist Mart',        webAddress: 'https://futuristmart.com',        physicalAddress: '123 Future Ave, Metropolis',        latitude: 40.7128, longitude: -74.0060 },
  { storeId: 2,  storeName: 'Neon Plaza',           webAddress: 'https://neonplaza.com',            physicalAddress: '456 Neon Blvd, Cyber City',         latitude: 34.0522, longitude: -118.2437 },
  { storeId: 3,  storeName: 'Quantum Storefront',   webAddress: 'https://quantumstorefront.com',    physicalAddress: '789 Quantum Rd, Silicon Valley',    latitude: 37.7749, longitude: -122.4194 },
  { storeId: 4,  storeName: 'Holo Market',          webAddress: 'https://holomarket.io',            physicalAddress: '12 Projection Way, Neo District',   latitude: 47.6062, longitude: -122.3321 },
  { storeId: 5,  storeName: 'Pulse Outlet',         webAddress: 'https://pulseoutlet.io',           physicalAddress: '88 Energy Loop, Tech Park',         latitude: 41.8781, longitude: -87.6298 },
  { storeId: 6,  storeName: 'Aurora Hub',           webAddress: 'https://aurorahub.net',            physicalAddress: '501 Dawn Rise, Polar City',         latitude: 64.2008, longitude: -149.4937 },
  { storeId: 7,  storeName: 'Circuit Central',      webAddress: 'https://circuitcentral.io',        physicalAddress: '300 Logic Lane, Core Sector',       latitude: 29.7604, longitude: -95.3698 },
  { storeId: 8,  storeName: 'Vertex Commerce',      webAddress: 'https://vertexcommerce.com',       physicalAddress: '77 Apex Tower, Summit Zone',        latitude: 39.7392, longitude: -104.9903 },
  { storeId: 9,  storeName: 'Flux Depot',           webAddress: 'https://fluxdepot.com',            physicalAddress: '19 Flow Street, Gradient City',     latitude: 32.7767, longitude: -96.7970 },
  { storeId: 10, storeName: 'Prism Retail Lab',     webAddress: 'https://prismretail.io',           physicalAddress: '44 Spectrum Ave, Color District',   latitude: 33.4484, longitude: -112.0740 },
  { storeId: 11, storeName: 'Nova Supply',          webAddress: 'https://novasupply.com',           physicalAddress: '5 Starfield Blvd, Galaxy Park',     latitude: 25.7617, longitude: -80.1918 },
  { storeId: 12, storeName: 'Lumen Outlet',         webAddress: 'https://lumenoutlet.io',           physicalAddress: '140 Light Path, Radiant Sector',    latitude: 36.1627, longitude: -86.7816 }
];

export default function Stores() {
  const [stores, setStores] = useState(initialStores);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ storeName: '', webAddress: '', physicalAddress: '', latitude: '', longitude: '' });
  const [editing, setEditing] = useState(null);
  const nextId = useRef(initialStores.length + 1);

  const handleOpen = (store = null) => {
    setEditing(store);
    setForm(
      store
        ? {
            ...store,
            latitude: store.latitude?.toString() ?? '',
            longitude: store.longitude?.toString() ?? ''
          }
        : { storeName: '', webAddress: '', physicalAddress: '', latitude: '', longitude: '' }
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
    const payload = {
      storeId: editing ? editing.storeId : nextId.current++,
      storeName: form.storeName,
      webAddress: form.webAddress,
      physicalAddress: form.physicalAddress,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null
    };
    if (editing) {
      setStores((s) => s.map((r) => (r.storeId === editing.storeId ? payload : r)));
    } else {
      setStores((s) => [...s, payload]);
    }
    handleClose();
  };

  const handleDelete = (storeId) => {
    setStores((s) => s.filter((r) => r.storeId !== storeId));
  };

  const filteredStores = stores.filter((st) => {
    const q = searchTerm.toLowerCase();
    return (
      st.storeName.toLowerCase().includes(q) ||
      st.physicalAddress.toLowerCase().includes(q) ||
      st.webAddress.toLowerCase().includes(q) ||
      String(st.storeId).includes(q)
    );
  });

  const columns = [
    {
      field: 'storeId',
      headerName: 'ID',
      width: 80,
      renderCell: (params) => (
        <span style={{ color: '#818cf8', fontWeight: 700 }}>#{params.row.storeId}</span>
      )
    },
    {
      field: 'storeName',
      headerName: 'Store Name',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <span style={{ color: 'white', fontWeight: 700 }}>🏬 {params.row.storeName}</span>
      )
    },
    {
      field: 'physicalAddress',
      headerName: 'Physical Address',
      flex: 2,
      minWidth: 220,
      renderCell: (params) => (
        <span style={{ color: '#cbd5e1' }}>📍 {params.row.physicalAddress}</span>
      )
    },
    {
      field: 'webAddress',
      headerName: 'Web Portal',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <a
          href={params.row.webAddress}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
        >
          🌐 {params.row.webAddress.replace(/^https?:\/\//, '')}
        </a>
      )
    },
    {
      field: 'coordinates',
      headerName: 'Coordinates',
      width: 170,
      renderCell: (params) => (
        <Chip
          size="small"
          label={`${params.row.latitude?.toFixed(2) ?? 0}, ${params.row.longitude?.toFixed(2) ?? 0}`}
          sx={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '0.75rem' }}
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
          <Tooltip title="Edit Store">
            <IconButton
              size="small"
              onClick={() => handleOpen(params.row)}
              sx={{ color: '#60a5fa', background: 'rgba(59,130,246,0.1)', '&:hover': { background: 'rgba(59,130,246,0.2)' } }}
            >
              ✏️
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Store">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.storeId)}
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
            <span>🏬</span> Retail Outlets & Stores
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
            Manage physical retail locations, geographical geofencing, and web portals.
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
          ➕ Register New Store
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
            placeholder="Search stores by name, city, address..."
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
            label={`${filteredStores.length} Retail Locations`}
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
            rows={filteredStores}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            getRowId={(row) => row.storeId}
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
          {editing ? '✏️ Edit Store Outlet' : '➕ Register Store Outlet'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Store Name"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Physical Address"
              name="physicalAddress"
              value={form.physicalAddress}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <TextField
              label="Website URL"
              name="webAddress"
              value={form.webAddress}
              onChange={handleChange}
              fullWidth
              sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                type="number"
                fullWidth
                sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', '& .MuiInputBase-input': { color: 'white' } }}
              />
              <TextField
                label="Longitude"
                name="longitude"
                value={form.longitude}
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
            Save Store
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}