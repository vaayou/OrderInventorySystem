import { DataGrid } from '@mui/x-data-grid';
import { useState, useRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

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

export default function Shipments() {
  const [shipments, setShipments] = useState(initialShipments);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ storeId: '', customerId: '', deliveryAddress: '', shipmentStatus: '' });
  const [editing, setEditing] = useState(null);
  const nextId = useRef(initialShipments.length + 1);

  const handleOpen = (shipment = null) => {
    setEditing(shipment);
    setForm(
      shipment
        ? { ...shipment }
        : { storeId: '', customerId: '', deliveryAddress: '', shipmentStatus: '' }
    );
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (editing) {
      setShipments(s =>
        s.map(r => (r.shipmentId === editing.shipmentId
          ? { ...r, ...form, storeId: Number(form.storeId), customerId: Number(form.customerId) }
          : r))
      );
    } else {
      const newRow = {
        shipmentId: nextId.current++,
        storeId: Number(form.storeId),
        customerId: Number(form.customerId),
        deliveryAddress: form.deliveryAddress,
        shipmentStatus: form.shipmentStatus || 'PENDING'
      };
      setShipments(s => [...s, newRow]);
    }
    handleClose();
  };

  const handleDelete = (shipmentId) => {
    setShipments(s => s.filter(r => r.shipmentId !== shipmentId));
  };

  const columns = [
    { field: 'shipmentId', headerName: 'ID', width: 80 },
    { field: 'storeId', headerName: 'Store ID', flex: 1, minWidth: 110 },
    { field: 'customerId', headerName: 'Customer ID', flex: 1, minWidth: 130 },
    { field: 'deliveryAddress', headerName: 'Delivery Address', flex: 2, minWidth: 220 },
    { field: 'shipmentStatus', headerName: 'Status', flex: 1, minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.shipmentId)}
          >
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shipments (Local Temp Data)</h2>
        <Button variant="contained" onClick={() => handleOpen()}>Add Shipment</Button>
      </div>
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
            rows={shipments}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            getRowId={row => row.shipmentId}
            disableRowSelectionOnClick
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Shipment' : 'Add Shipment'}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField label="Store ID" name="storeId" value={form.storeId} onChange={handleChange} type="number" fullWidth />
          <TextField label="Customer ID" name="customerId" value={form.customerId} onChange={handleChange} type="number" fullWidth />
          <TextField label="Delivery Address" name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} fullWidth />
          <TextField label="Status" name="shipmentStatus" value={form.shipmentStatus} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
// ...e