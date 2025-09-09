import { DataGrid } from '@mui/x-data-grid';
import { useState, useRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Expanded temporary sample data
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
  { storeId:10,  storeName: 'Prism Retail Lab',     webAddress: 'https://prismretail.io',           physicalAddress: '44 Spectrum Ave, Color District',   latitude: 33.4484, longitude: -112.0740 },
  { storeId:11,  storeName: 'Nova Supply',          webAddress: 'https://novasupply.com',           physicalAddress: '5 Starfield Blvd, Galaxy Park',    latitude: 25.7617, longitude: -80.1918 },
  { storeId:12,  storeName: 'Lumen Outlet',         webAddress: 'https://lumenoutlet.io',           physicalAddress: '140 Light Path, Radiant Sector',    latitude: 36.1627, longitude: -86.7816 }
];

export default function Stores() {
  const [stores, setStores] = useState(initialStores);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ storeName: '', webAddress: '', physicalAddress: '', latitude: '', longitude: '' });
  const [editing, setEditing] = useState(null);
  const nextId = useRef(initialStores.length + 1);

  const handleOpen = (store = null) => {
    setEditing(store);
    setForm(store
      ? {
          ...store,
          latitude: store.latitude?.toString() ?? '',
          longitude: store.longitude?.toString() ?? ''
        }
      : { storeName: '', webAddress: '', physicalAddress: '', latitude: '', longitude: '' });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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
      setStores(s => s.map(r => r.storeId === editing.storeId ? payload : r));
    } else {
      setStores(s => [...s, payload]);
    }
    handleClose();
  };

  const handleDelete = (storeId) => {
    setStores(s => s.filter(r => r.storeId !== storeId));
  };

  const columns = [
    { field: 'storeId', headerName: 'ID', width: 80 },
    { field: 'storeName', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'webAddress', headerName: 'Web Address', flex: 1, minWidth: 180 },
    { field: 'physicalAddress', headerName: 'Physical Address', flex: 1, minWidth: 220 },
    { field: 'latitude', headerName: 'Latitude', width: 110, valueFormatter: p => p.value ?? '' },
    { field: 'longitude', headerName: 'Longitude', width: 120, valueFormatter: p => p.value ?? '' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.row.storeId)}>Delete</Button>
        </>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
        <Typography variant="h4" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                    Stores
                  </Typography>
      <Paper elevation={3} className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-100">

        <div className="flex justify-between items-center mb-4">

          <Button variant="contained" onClick={() => handleOpen()}>Add Store</Button>
        </div>
        <Typography variant="body2" className="mb-4 text-gray-600">
          This view uses in-memory sample data. No backend requests are made.
        </Typography>
        <div style={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={stores}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5,10]}
            getRowId={r => r.storeId}
            disableRowSelectionOnClick
          />
        </div>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Store' : 'Add Store'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField label="Name" name="storeName" value={form.storeName} onChange={handleChange} fullWidth />
            <TextField label="Web Address" name="webAddress" value={form.webAddress} onChange={handleChange} fullWidth />
            <TextField label="Physical Address" name="physicalAddress" value={form.physicalAddress} onChange={handleChange} fullWidth />
            <TextField label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} type="number" fullWidth />
            <TextField label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} type="number" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}