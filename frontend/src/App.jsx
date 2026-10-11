import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Shipments from './pages/Shipments';
import Stores from './pages/Stores';
import Landing from './pages/Landing';

import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#06b6d4',
    },
    background: {
      default: '#0a0f1d',
      paper: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          color: '#f8fafc',
        },
        columnHeaders: {
          backgroundColor: '#1e293b',
          color: '#38bdf8',
        },
        columnHeader: {
          backgroundColor: '#1e293b',
          color: '#38bdf8',
        },
        columnHeaderTitle: {
          color: '#38bdf8',
          fontWeight: 800,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="customers" element={<Customers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="stores" element={<Stores />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
