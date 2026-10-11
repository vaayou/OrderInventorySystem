import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';

// Helper to determine status color styling
const getStatusBadge = (status = '') => {
  const s = String(status).toUpperCase();
  if (s.includes('DELIVER') || s.includes('COMPLET')) {
    return {
      bg: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: 'rgba(16, 185, 129, 0.3)',
      icon: '✅',
      label: s || 'COMPLETED'
    };
  }
  if (s.includes('PEND')) {
    return {
      bg: 'rgba(245, 158, 11, 0.15)',
      color: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.3)',
      icon: '⏳',
      label: s || 'PENDING'
    };
  }
  if (s.includes('OVERDUE')) {
    return {
      bg: 'rgba(244, 63, 94, 0.2)',
      color: '#fb7185',
      border: 'rgba(244, 63, 94, 0.4)',
      icon: '⚠️',
      label: s || 'OVERDUE'
    };
  }
  if (s.includes('SHIP') || s.includes('TRANSIT')) {
    return {
      bg: 'rgba(59, 130, 246, 0.15)',
      color: '#60a5fa',
      border: 'rgba(59, 130, 246, 0.3)',
      icon: '🚚',
      label: s || 'SHIPPED'
    };
  }
  if (s.includes('CANCEL')) {
    return {
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: 'rgba(239, 68, 68, 0.3)',
      icon: '❌',
      label: s || 'CANCELLED'
    };
  }
  return {
    bg: 'rgba(148, 163, 184, 0.15)',
    color: '#cbd5e1',
    border: 'rgba(148, 163, 184, 0.3)',
    icon: '📦',
    label: s || 'PROCESSING'
  };
};

export default function DataViewModal({
  open,
  onClose,
  title,
  type = 'generic', // 'stats', 'customers', 'orders', 'shipments', 'search', 'generic'
  data = null,
  onViewOrders = null,
  onViewShipments = null,
  badgeIcon = '📋'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. RENDER SHIPMENT STATS
  const renderStatsView = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          <Typography variant="body1">No shipment statistics found.</Typography>
        </Box>
      );
    }

    const totalCustomers = data.reduce((acc, curr) => acc + (Number(curr.customerCount) || 0), 0);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Top summary card */}
        <Box
          sx={{
            p: 3,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(6,182,212,0.15) 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overall Metrics
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mt: 0.5 }}>
              {totalCustomers} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#38bdf8' }}>Total Customer Shipments</span>
            </Typography>
          </Box>
          <Chip
            label={`${data.length} Status Categories`}
            sx={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          />
        </Box>

        {/* Visual Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${Math.min(data.length, 3)}, 1fr)` },
            gap: 2
          }}
        >
          {data.map((item, idx) => {
            const count = Number(item.customerCount) || 0;
            const percentage = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;
            const badge = getStatusBadge(item.shipmentStatus);

            return (
              <Box
                key={idx}
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${badge.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    background: 'rgba(255,255,255,0.06)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.25rem' }}>{badge.icon}</span>
                    <Typography sx={{ fontWeight: 700, color: badge.color, fontSize: '0.9rem' }}>
                      {item.shipmentStatus}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                    {percentage}%
                  </Typography>
                </Box>

                <Typography variant="h3" sx={{ fontWeight: 800, color: 'white' }}>
                  {count}
                </Typography>

                <Box sx={{ width: '100%', mt: 0.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: badge.color,
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Detailed Breakdown Table */}
        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <Table size="small">
            <TableHead sx={{ background: 'rgba(30, 41, 59, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>STATUS</TableCell>
                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700 }}>CUSTOMER COUNT</TableCell>
                <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700 }}>SHARE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, idx) => {
                const count = Number(item.customerCount) || 0;
                const percentage = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0;
                const badge = getStatusBadge(item.shipmentStatus);
                return (
                  <TableRow key={idx} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                    <TableCell sx={{ color: 'white' }}>
                      <Chip
                        size="small"
                        icon={<span style={{ marginLeft: 6 }}>{badge.icon}</span>}
                        label={item.shipmentStatus}
                        sx={{
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          fontWeight: 700
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                      {count}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                      {percentage}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // 2. RENDER CUSTOMERS LIST (Pending Shipments, Completed Orders, Overdue Shipments, Qty Range)
  const renderCustomersList = () => {
    let customerList = [];
    if (Array.isArray(data)) {
      customerList = data;
    } else if (data && typeof data === 'object') {
      customerList = [data];
    }

    if (!customerList || customerList.length === 0) {
      return (
        <Box sx={{ p: 5, textAlign: 'center', color: '#94a3b8' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>No Customers Found</Typography>
          <Typography variant="body2">There are currently no records matching this query.</Typography>
        </Box>
      );
    }

    const filtered = customerList.filter(c => {
      const q = searchTerm.toLowerCase();
      return (
        String(c.fullName || '').toLowerCase().includes(q) ||
        String(c.emailAddress || '').toLowerCase().includes(q) ||
        String(c.customerId || '').includes(q)
      );
    });

    const isOverdue = title.toLowerCase().includes('overdue');
    const isPending = title.toLowerCase().includes('pending');
    const isCompleted = title.toLowerCase().includes('completed');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Banner for context */}
        {isOverdue && (
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#fb7185', fontSize: '0.9rem' }}>
                Priority Action Required
              </Typography>
              <Typography variant="caption" sx={{ color: '#fecdd3' }}>
                These customers have shipments exceeding normal transit time thresholds.
              </Typography>
            </Box>
          </Box>
        )}

        {/* Filter and stats row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            placeholder="Filter by name, email, or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: { xs: '100%', sm: 300 },
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              '& .MuiInputBase-input': { color: 'white' }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>
            }}
          />
          <Chip
            label={`${filtered.length} Customer${filtered.length === 1 ? '' : 's'}`}
            sx={{
              background: isOverdue ? 'rgba(244,63,94,0.2)' : isPending ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
              color: isOverdue ? '#fb7185' : isPending ? '#fbbf24' : '#34d399',
              fontWeight: 700,
              border: `1px solid ${isOverdue ? 'rgba(244,63,94,0.4)' : isPending ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}`
            }}
          />
        </Box>

        {/* Customer Cards / Table */}
        <TableContainer
          component={Paper}
          sx={{
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
            maxHeight: '440px'
          }}
        >
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow sx={{ '& th': { background: '#1e293b', color: '#94a3b8', fontWeight: 700 } }}>
                <TableCell>CUSTOMER</TableCell>
                <TableCell>EMAIL ADDRESS</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => {
                const initials = (c.fullName || 'C')
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <TableRow
                    key={c.customerId}
                    sx={{
                      '&:hover': { background: 'rgba(255,255,255,0.04)' },
                      borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <TableCell sx={{ color: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            background: isOverdue
                              ? 'linear-gradient(135deg, #f43f5e, #be123c)'
                              : isPending
                              ? 'linear-gradient(135deg, #f59e0b, #b45309)'
                              : 'linear-gradient(135deg, #6366f1, #3b82f6)'
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
                            {c.fullName || 'Unnamed Customer'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            ID: #{c.customerId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ color: '#cbd5e1' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{c.emailAddress || 'N/A'}</Typography>
                        {c.emailAddress && (
                          <Tooltip title={copiedId === c.customerId ? 'Copied!' : 'Copy Email'}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(c.emailAddress, c.customerId)}
                              sx={{ color: '#64748b', '&:hover': { color: '#38bdf8' } }}
                            >
                              📋
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={isOverdue ? 'OVERDUE' : isPending ? 'PENDING' : isCompleted ? 'COMPLETED' : 'ACTIVE'}
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: isOverdue
                            ? 'rgba(244,63,94,0.15)'
                            : isPending
                            ? 'rgba(245,158,11,0.15)'
                            : 'rgba(16,185,129,0.15)',
                          color: isOverdue ? '#fb7185' : isPending ? '#fbbf24' : '#34d399',
                          border: `1px solid ${isOverdue ? 'rgba(244,63,94,0.3)' : isPending ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {onViewOrders && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onViewOrders(c.customerId)}
                            sx={{
                              fontSize: '0.75rem',
                              borderColor: 'rgba(99,102,241,0.4)',
                              color: '#818cf8',
                              textTransform: 'none',
                              '&:hover': { borderColor: '#818cf8', background: 'rgba(99,102,241,0.1)' }
                            }}
                          >
                            Orders
                          </Button>
                        )}
                        {onViewShipments && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onViewShipments(c.customerId)}
                            sx={{
                              fontSize: '0.75rem',
                              borderColor: 'rgba(245,158,11,0.4)',
                              color: '#fbbf24',
                              textTransform: 'none',
                              '&:hover': { borderColor: '#fbbf24', background: 'rgba(245,158,11,0.1)' }
                            }}
                          >
                            Shipments
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // 3. RENDER CUSTOMER ORDERS (CustomerWithOrdersDTO)
  const renderOrdersView = () => {
    if (!data) return null;
    const customer = data.customer || {};
    const orders = Array.isArray(data.orders) ? data.orders : [];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Customer Header card */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>
              Order History For
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
              {customer.fullName || 'Customer'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#38bdf8' }}>
              {customer.emailAddress} • ID: #{customer.customerId}
            </Typography>
          </Box>
          <Chip
            label={`${orders.length} Total Orders`}
            sx={{
              background: 'rgba(99,102,241,0.2)',
              color: '#818cf8',
              fontWeight: 700,
              border: '1px solid rgba(99,102,241,0.4)',
              fontSize: '0.85rem'
            }}
          />
        </Box>

        {orders.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
            <Typography>No orders found for this customer.</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Table size="small">
              <TableHead sx={{ background: '#1e293b' }}>
                <TableRow sx={{ '& th': { color: '#94a3b8', fontWeight: 700 } }}>
                  <TableCell>ORDER ID</TableCell>
                  <TableCell>DATE / TIME</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell align="right">STORE ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o) => {
                  const badge = getStatusBadge(o.orderStatus);
                  const orderDate = o.orderTms ? new Date(o.orderTms).toLocaleString() : 'N/A';
                  return (
                    <TableRow key={o.orderId} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>#{o.orderId}</TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>{orderDate}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={o.orderStatus}
                          sx={{
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            fontWeight: 700
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                        Store #{o.storeId}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

  // 4. RENDER CUSTOMER SHIPMENTS (CustomerWithShipmentsDTO)
  const renderShipmentsView = () => {
    if (!data) return null;
    const customer = data.customer || {};
    const shipments = Array.isArray(data.shipments) ? data.shipments : [];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Customer Header card */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>
              Shipments Log For
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
              {customer.fullName || 'Customer'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#38bdf8' }}>
              {customer.emailAddress} • ID: #{customer.customerId}
            </Typography>
          </Box>
          <Chip
            label={`${shipments.length} Total Shipments`}
            sx={{
              background: 'rgba(245,158,11,0.2)',
              color: '#fbbf24',
              fontWeight: 700,
              border: '1px solid rgba(245,158,11,0.4)',
              fontSize: '0.85rem'
            }}
          />
        </Box>

        {shipments.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
            <Typography>No shipments found for this customer.</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Table size="small">
              <TableHead sx={{ background: '#1e293b' }}>
                <TableRow sx={{ '& th': { color: '#94a3b8', fontWeight: 700 } }}>
                  <TableCell>SHIPMENT ID</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>DELIVERY ADDRESS</TableCell>
                  <TableCell align="right">STORE ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shipments.map((s) => {
                  const badge = getStatusBadge(s.shipmentStatus);
                  return (
                    <TableRow key={s.shipmentId} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>#{s.shipmentId}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={s.shipmentStatus}
                          sx={{
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            fontWeight: 700
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        📍 {s.deliveryAddress || 'Address on file'}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                        Store #{s.storeId}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

  // 5. RENDER SEARCH VIEW (Single customer or customer list)
  const renderSearchView = () => {
    if (!data) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
          <Typography>No search results found.</Typography>
        </Box>
      );
    }
    return renderCustomersList();
  };

  // Decide what to render based on `type` or data shape
  const renderContent = () => {
    if (type === 'stats') return renderStatsView();
    if (type === 'orders') return renderOrdersView();
    if (type === 'shipments') return renderShipmentsView();
    if (type === 'customers') return renderCustomersList();
    if (type === 'search') return renderSearchView();

    // Auto-detection fallback
    if (Array.isArray(data) && data[0] && 'shipmentStatus' in data[0] && 'customerCount' in data[0]) {
      return renderStatsView();
    }
    if (data && 'orders' in data && 'customer' in data) {
      return renderOrdersView();
    }
    if (data && 'shipments' in data && 'customer' in data) {
      return renderShipmentsView();
    }
    if (Array.isArray(data) && data[0] && 'customerId' in data[0]) {
      return renderCustomersList();
    }
    if (data && typeof data === 'object' && 'customerId' in data) {
      return renderCustomersList();
    }

    // Default clean structured key-value display if generic
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
          Structured Data Output:
        </Typography>
        <Box
          sx={{
            p: 2.5,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2
          }}
        >
          {data && typeof data === 'object' ? (
            Object.entries(data).map(([k, v]) => (
              <Box key={k} sx={{ p: 1.5, background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>
                  {k}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: 'white' }}>{String(data)}</Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          background: 'linear-gradient(90deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <span style={{ fontSize: '1.5rem' }}>{badgeIcon}</span>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: '0.02em' }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, my: 1 }}>
        {renderContent()}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': { background: '#4338ca' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
