# 🚗 Rentigo — Vehicle Rental System API

**Rentigo** is a backend API for a complete **Vehicle Rental Management System** that supports vehicle inventory, customer management, secure bookings, and role-based access control for **Admin** and **Customer** users.

---

## 🌍 Live URL

🔗 **Live API:** https://rentigo-tau.vercel.app
🔗 **GitHub Repository:** https://github.com/TarekNexus/Rentigo


---

## 🎯 Features

### ✅ Authentication System
- Secure sign up & sign in
- Password hashing using **bcrypt**
- JWT based authentication
- Role-based authorization (Admin & Customer)

---

### ✅ Vehicles Management
- Add, view, update, delete vehicles
- Track availability status (`available` / `booked`)
- Prevent deletion if active bookings exist
- Public and protected routes

---

### ✅ Booking System
- Create rental bookings
- Calculate rental cost automatically
- Set booking status: `active`, `cancelled`, `returned`
- Update vehicle status dynamically
- Auto return system after rental end date

---

### ✅ Role-Based Access

| Role     | Access Rights                                 |
|------|----------------------------------------------|
| Admin  | Full system access (Vehicles, Users, Bookings) |
| Customer | View vehicles, create & manage own bookings |

---

## 🛠️ Technology Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **dotenv**
- **pg (PostgreSQL Client)**

---


---

## 🌐 API Endpoints

### 🔑 Auth Routes

| Method | Endpoint | Access | Description |
|------|--------|------|------|
| POST | /api/v1/auth/signup | Public | Register a new user |
| POST | /api/v1/auth/signin | Public | Login & get token |

---

### 🚘 Vehicles Routes

| Method | Endpoint | Access | Description |
|------|--------|------|------|
| POST | /api/v1/vehicles | Admin | Add a new vehicle |
| GET | /api/v1/vehicles | Public | Get all vehicles |
| GET | /api/v1/vehicles/:vehicleId | Public | Get specific vehicle |
| PUT | /api/v1/vehicles/:vehicleId | Admin | Update a vehicle |
| DELETE | /api/v1/vehicles/:vehicleId | Admin | Delete vehicle (if no active booking) |

---

### 👤 Users Routes

| Method | Endpoint | Access | Description |
|------|--------|------|------|
| GET | /api/v1/users | Admin | Get all users |
| PUT | /api/v1/users/:userId | Admin / Own | Update profile |
| DELETE | /api/v1/users/:userId | Admin | Delete user |

---

### 📅 Bookings Routes

| Method | Endpoint | Access | Description |
|------|--------|------|------|
| POST | /api/v1/bookings | Customer / Admin | Create booking |
| GET | /api/v1/bookings | Role-Based | View bookings |
| PUT | /api/v1/bookings/:bookingId | Role-Based | Update booking status |

---




### ⚙️ Setup & Run Locally

## 1️⃣ Clone the project

```bash
git clone https://github.com/TarekNexus/Rentigo.git
cd rentigo

- npm install
- Create a .env file and add:
PORT=5000
DATABASE_URL=your_postgresql_connection
JWT_SECRET=your_secret_key
```

