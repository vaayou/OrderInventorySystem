# Order Inventory System (Frontend)

A modern, full-featured React + Vite + Tailwind CSS + Material UI frontend for managing customers, products, orders, inventory, shipments, and stores. Designed to work seamlessly with a Spring Boot + MySQL backend.

## Features
- Beautiful, responsive dashboard layout with navigation bar
- Customer, Product, Order, Inventory, Shipment, and Store management
- Advanced search, filter, and quick actions for customers
- Data tables with sorting, paging, and actions (edit, delete, view details)
- Modern UI using Material UI and Tailwind CSS
- Fluid grid layout for feature panels and data tables
- Works with RESTful Spring Boot backend (see backend folder)

## Tech Stack
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [@mui/x-data-grid](https://mui.com/x/react-data-grid/)
- [Axios](https://axios-http.com/) (via `src/api.js`)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Backend API running (see `/OrderInvertory` Spring Boot project)

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

## Project Structure
```
frontend/
  src/
    api.js           # Axios API instance
    App.jsx          # Main app and routes
    App.css          # Custom styles
    components/
      Layout.jsx     # Main layout and navigation
    pages/
      Customers.jsx  # Customer management UI
      ...            # Other entity pages
```

## Customization
- Edit `src/pages/Customers.jsx` and other pages to adjust features or UI.
- Tailwind and Material UI can be customized via `tailwind.config.js` and theme overrides.

## Backend
- See `/OrderInvertory` for the Spring Boot backend (controllers, entities, DTOs, etc).
- The frontend expects the backend to be running on the same host or update API URLs in `src/api.js`.

## License
MIT

---
Built with ❤️ using React, Material UI, and Tailwind CSS.

