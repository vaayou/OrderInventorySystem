import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Shipments from './pages/Shipments';
import Stores from './pages/Stores';
import Landing from './pages/Landing';

import './App.css';

function App() {
  return (
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
  );
}

export default App;
