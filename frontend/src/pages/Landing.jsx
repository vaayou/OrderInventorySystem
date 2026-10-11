import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Chip
} from '@mui/material';

const modules = [
  {
    to: '/customers',
    icon: '👥',
    title: 'Customer Directory',
    desc: 'Manage profiles, query pending & overdue shipments, analyze status breakdowns, and track order volumes.',
    badge: 'Core CRM',
    color: '#06b6d4'
  },
  {
    to: '/orders',
    icon: '📋',
    title: 'Orders Hub',
    desc: 'Audit real-time transactional sales, customer checkouts, timestamps, fulfillment pipelines, and store links.',
    badge: 'Live Stream',
    color: '#6366f1'
  },
  {
    to: '/shipments',
    icon: '🚚',
    title: 'Shipments & Logistics',
    desc: 'Monitor delivery transit lifecycles, pending dispatches, carrier addresses, and shipment status matrices.',
    badge: 'Fulfillment',
    color: '#f59e0b'
  },
  {
    to: '/inventory',
    icon: '📦',
    title: 'Warehouse Inventory',
    desc: 'Multi-store stock level tracking, SKU quantity allocations, automatic low-stock alerts, and restocking logs.',
    badge: 'Stock Levels',
    color: '#10b981'
  },
  {
    to: '/products',
    icon: '🏷️',
    title: 'Products Catalog',
    desc: 'Manage SKU listings, brand collections, categories, customer review ratings, and price schedules.',
    badge: 'E-Commerce',
    color: '#ec4899'
  },
  {
    to: '/stores',
    icon: '🏬',
    title: 'Retail Outlets',
    desc: 'Coordinate brick-and-mortar stores, GPS coordinates, geofences, physical addresses, and eCommerce portals.',
    badge: 'Omnichannel',
    color: '#8b5cf6'
  }
];

export default function Landing() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, py: 2 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
          <Chip
            label="⚡ Production Live on Render & Netlify"
            sx={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontWeight: 700,
              fontSize: '0.8rem',
              px: 1
            }}
          />
          <Chip
            label="MySQL 8 via Aiven Cloud"
            sx={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 700,
              fontSize: '0.8rem',
              px: 1
            }}
          />
        </Stack>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.25rem' },
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 70%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Next-Gen Order & <br /> Inventory Management
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#94a3b8',
            maxWidth: '750px',
            mx: 'auto',
            mb: 5,
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}
        >
          An enterprise-grade distribution system orchestrating customer orders, warehouse inventory,
          real-time shipments, and cross-channel store operations with low latency.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
          <Button
            variant="contained"
            component={Link}
            to="/customers"
            sx={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
              borderRadius: '14px',
              fontSize: '1.05rem',
              fontWeight: 700,
              px: 4,
              py: 1.75,
              textTransform: 'none',
              boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(99, 102, 241, 0.6)'
              }
            }}
          >
            🚀 Launch Dashboard
          </Button>

          <Button
            variant="outlined"
            component="a"
            href="https://foil-poinsettia-75d.notion.site/Order-Inventory-74bdd4829f9f4e41a25a510e7c5dd6f8"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: '14px',
              fontSize: '1.05rem',
              fontWeight: 600,
              px: 3.5,
              py: 1.75,
              textTransform: 'none',
              color: '#e2e8f0',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                borderColor: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.08)'
              }
            }}
          >
            📖 View LLD Specification
          </Button>
        </Stack>
      </Box>

      {/* Modules Grid */}
      <Box>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 700, letterSpacing: '0.1em' }}>
            SYSTEM CAPABILITIES
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mt: 0.5 }}>
            Enterprise Modules at a Glance
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3
          }}
        >
          {modules.map((mod) => (
            <Paper
              key={mod.to}
              component={Link}
              to={mod.to}
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: '20px',
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: mod.color,
                  boxShadow: `0 12px 30px rgba(0,0,0,0.4), 0 0 20px ${mod.color}33`
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '14px',
                      background: `${mod.color}1a`,
                      border: `1px solid ${mod.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem'
                    }}
                  >
                    {mod.icon}
                  </Box>
                  <Chip
                    size="small"
                    label={mod.badge}
                    sx={{
                      background: 'rgba(255,255,255,0.06)',
                      color: mod.color,
                      fontWeight: 700,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mb: 1.5 }}>
                  {mod.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 3 }}>
                  {mod.desc}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: mod.color,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                Access Module &rarr;
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Cloud Architecture Showcase */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="overline" sx={{ color: '#34d399', fontWeight: 700, letterSpacing: '0.1em' }}>
            DEPLOYED INFRASTRUCTURE
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mt: 0.5 }}>
            Production Cloud Architecture
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1, maxWidth: '650px', mx: 'auto' }}>
            Fully containerized and deployed across premier cloud services for reliable uptime and continuous integration.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2.5
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>🖥️</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
              Render
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5 }}>
              Dockerized Spring Boot 3 API Container
            </Typography>
            <Chip size="small" label="Host: Port 8080" sx={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }} />
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>🌐</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
              Netlify
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5 }}>
              Vite + React 19 Frontend with SPA redirects
            </Typography>
            <Chip size="small" label="ordermanage7.netlify.app" sx={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }} />
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>🗄️</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
              Aiven MySQL
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5 }}>
              Managed Cloud Relational Database Instance
            </Typography>
            <Chip size="small" label="MySQL 8.0 SSL" sx={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }} />
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>📐</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
              Notion LLD
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5 }}>
              Architectural schemas, ER diagrams & API specs
            </Typography>
            <Chip size="small" label="Architecture Docs" sx={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc' }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
