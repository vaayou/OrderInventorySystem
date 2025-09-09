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

The backend for this project is a Spring Boot application using MySQL and JPA/Hibernate, designed to provide a robust RESTful API for all inventory and order management features. It is located in the `/OrderInvertory` directory at the root of this repository.

### Key Features
- **Spring Boot**: Modern Java backend framework for rapid development
- **MySQL**: Relational database for persistent storage
- **Spring Data JPA**: ORM for easy database access and entity management
- **Lombok**: Reduces boilerplate code in Java classes
- **RESTful Controllers**: Exposes endpoints for Customers, Products, Orders, Inventory, Shipments, and Stores
- **DTOs**: Data Transfer Objects for efficient and secure API responses
- **Service Layer**: Business logic separated from controllers
- **Repository Layer**: JPA repositories for all entities

### Structure
```
OrderInvertory/
  src/main/java/com/vaayu/OrderInvertory/
    controller/   # REST controllers (CustomerController, ProductController, etc)
    dto/          # Data Transfer Objects for API responses
    entity/       # JPA entities (Customer, Product, Order, etc)
    repository/   # Spring Data JPA repositories
    service/      # Business logic and service classes
  src/main/resources/
    application.properties  # DB config, server port, etc
```

### Example Endpoints
- `GET /api/v1/customers` — List all customers
- `POST /api/v1/customers` — Add a new customer
- `PUT /api/v1/customers` — Update a customer
- `DELETE /api/v1/customers/{id}` — Delete a customer
- `GET /api/v1/orders` — List all orders
- ...and similar endpoints for products, inventory, shipments, and stores

### Running the Backend
1. Configure your MySQL database in `OrderInvertory/src/main/resources/application.properties`.
2. Build and run the Spring Boot app:
   ```bash
   cd OrderInvertory
   ./mvnw spring-boot:run
   ```
3. The backend will be available at `http://localhost:8080` by default.

---

For more details, see the code and documentation in the `/OrderInvertory` directory.

## License
MIT

---
Built with ❤️ using React, Material UI, and Tailwind CSS.
