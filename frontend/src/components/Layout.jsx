import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Tooltip,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Paper,
  Stack,
  Chip
} from "@mui/material";

const navLinks = [
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/orders", label: "Orders", icon: "📋" },
  { to: "/shipments", label: "Shipments", icon: "🚚" },
  { to: "/inventory", label: "Inventory", icon: "📦" },
  { to: "/products", label: "Products", icon: "🏷️" },
  { to: "/stores", label: "Stores", icon: "🏬" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 50% -20%, #1e1b4b 0%, #0a0f1d 60%, #030712 100%)',
        color: '#f8fafc'
      }}
    >
      {/* Top accent glow line */}
      <Box
        sx={{
          height: '3px',
          width: '100%',
          background: 'linear-gradient(90deg, #06b6d4, #6366f1, #a855f7, #ec4899)'
        }}
      />

      {/* Main Glass Navigation Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, px: { xs: 2, md: 4 } }}>
          {/* Brand Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                OrderInventory
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Cloud Distribution Suite
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: 'none', md: 'flex' },
              background: 'rgba(255, 255, 255, 0.03)',
              p: 0.75,
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Box
                  key={link.to}
                  component={Link}
                  to={link.to}
                  sx={{ textDecoration: 'none' }}
                >
                  <Chip
                    icon={<span style={{ fontSize: '0.9rem', marginLeft: 4 }}>{link.icon}</span>}
                    label={link.label}
                    clickable
                    sx={{
                      height: 36,
                      fontSize: '0.825rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#94a3b8',
                      background: isActive
                        ? 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(99, 102, 241, 0.5)'
                        : '1px solid transparent',
                      boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.35)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        color: 'white',
                        background: isActive
                          ? 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)'
                          : 'rgba(255, 255, 255, 0.08)'
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Stack>

          {/* System Badges & Links */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Backend deployed on Render with Aiven MySQL">
              <Chip
                size="small"
                label="● API Live"
                sx={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}
              />
            </Tooltip>
            <Tooltip title="Low Level Design (LLD) Documentation">
              <Chip
                component="a"
                href="https://foil-poinsettia-75d.notion.site/Order-Inventory-74bdd4829f9f4e41a25a510e7c5dd6f8"
                target="_blank"
                rel="noopener noreferrer"
                clickable
                size="small"
                label="LLD Docs"
                sx={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.15)', color: 'white' }
                }}
              />
            </Tooltip>
          </Stack>
        </Toolbar>

        {/* Mobile Navigation bar */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            overflowX: 'auto',
            p: 1.5,
            gap: 1,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Chip
                key={link.to}
                component={Link}
                to={link.to}
                clickable
                size="small"
                label={link.label}
                sx={{
                  color: isActive ? 'white' : '#94a3b8',
                  background: isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
                  fontWeight: 600
                }}
              />
            );
          })}
        </Box>
      </AppBar>

      {/* Main Page Container */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            p: { xs: 2.5, sm: 4, md: 5 },
            minHeight: '70vh',
            color: 'white'
          }}
        >
          <Outlet />
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(10, 15, 29, 0.8)',
          backdropFilter: 'blur(10px)',
          py: 4,
          px: 3,
          mt: 'auto'
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>
                Order & Inventory Management System
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Enterprise Spring Boot 3 Microservice • MySQL 8 (Aiven) • React 19 Frontend
              </Typography>
            </Box>

            <Stack direction="row" spacing={3} sx={{ fontSize: '0.85rem' }}>
              <a
                href="https://orderinventorysystem-1y9i.onrender.com/api/v1/customers"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
              >
                Render Backend
              </a>
              <a
                href="https://ordermanage7.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}
              >
                Netlify Web App
              </a>
              <a
                href="https://github.com/vaayou"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}
              >
                GitHub Profile
              </a>
              <a
                href="https://www.linkedin.com/in/vaayou/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}
              >
                LinkedIn
              </a>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
