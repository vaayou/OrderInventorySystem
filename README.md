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

check## Docker & Production Deployment

1) Prepare environment file

- Copy example and edit secrets:
  - cp .env.prod.example .env.prod
  - Update MYSQL passwords, REACT_APP_API_URL (set to empty or `/api` if using nginx proxy), and ports.

2) Build and run with Docker Compose (local or on a server)

- Build and start (detached):
  - docker compose -f docker-compose.yml up --build -d
  - For the production compose file (if present):
    - docker compose -f docker-compose.prod.yml up --build -d

3) Rebuild frontend to use relative API path (recommended)

- Ensure REACT_APP_API_URL is empty or set to `/api` before building frontend. Example (build locally):
  - cd frontend
  - REACT_APP_API_URL="" npm run build

4) Push images to Docker Hub

- Build and tag images (example names):
  - docker build -t <yourhubuser>/order-inventory-backend:latest -f OrderInvertory/Dockerfile .
  - docker build -t <yourhubuser>/order-inventory-frontend:latest -f frontend/Dockerfile frontend

- Login and push:
  - docker login
  - docker push <yourhubuser>/order-inventory-backend:latest
  - docker push <yourhubuser>/order-inventory-frontend:latest

5) Run on EC2

- Options:
  - EC2 (simple): Provision an EC2 instance, install Docker and Docker Compose, copy repository or pull images from Docker Hub, then run `docker compose up -d`.
  - Use an AMI with Docker preinstalled or follow `setup-amazon-linux.sh` in this repo.
- Remember to open required security group ports (80, 443, 8080 if exposing backend directly, and 3306 only if you need DB access externally — avoid exposing MySQL publicly).

6) Exec into MySQL container

- Use Docker Compose to open a shell in the running DB container and run mysql client:
  - docker compose exec mysql bash
  - mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE}

- Alternatively, run mysql client directly from host (mapped port 3307 by compose):
  - mysql -h127.0.0.1 -P3307 -uapp_user -proot db

7) Notes & troubleshooting

- CORS: A global CORS configuration has been added to the Spring Boot backend to allow localhost origins on any port and all paths (`/**`). If you still see CORS errors, confirm frontend is calling backend via the nginx proxy (use relative paths `/api/...`), or check response headers from the backend.

- Caching / index.html: nginx is configured to serve `index.html` with `Cache-Control: no-cache` so browsers revalidate the HTML while static hashed assets are cached for a long time. If you see stale UI, clear browser cache or restart the frontend container after a deploy.

- API proxy: nginx in the frontend container proxies `/api/` and `/v1/` to the backend service name used by Docker Compose `order-inventory-backend:8080`. Ensure your frontend uses relative URLs so the browser hits nginx and is proxied to backend.

- Healthchecks: Compose includes basic healthchecks for services; check `docker compose ps` and `docker compose logs -f <service>` when debugging.

---

For more details, see the code and documentation in the `/OrderInvertory` directory.

## License
MIT

---
Built with ❤️ using React, Material UI, and Tailwind CSS.
