# MedBook Doctor Appointment System

MedBook is a high-concurrency doctor appointment booking system designed to handle thousands of simultaneous users without overbooking or race conditions.

## 🚀 Key Features
- **Modern UI**: Built with React.js using a Premium Healthcare design system (Glassmorphism & Inter typography).
- **Concurrency Control**: Atomic database operations to prevent seat overbooking.
- **Admin Control**: Dedicated panel for managing doctors and session slots.
- **Booking Lifecycle**: Tracks PENDING, CONFIRMED, and FAILED states.
- **Automatic Expiry**: Background worker reverts abandoned PENDING bookings after 2 minutes.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Axios, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Auth**: JWT (JSON Web Tokens) with Role-Based Access Control.
- **Cron**: Node-cron for background cleaning tasks.

---

## 🛠️ Setup Instructions

### 1. Database
Ensure you have MongoDB running locally at `mongodb://localhost:27017/doctor_appointment` or provide your Atlas URI in `.env`.

### 2. Backend
```bash
# From root directory
npm install
npm install -g nodemon # Optional
# Create .env (already provided)
node index.js
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

---

## 📖 API Documentation

### Auth
- `POST /api/auth/register`: Create a new user (Role: USER or ADMIN).
- `POST /api/auth/login`: Authenticate and receive JWT.

### Doctors & Slots
- `GET /api/doctors`: Fetch all registered doctors.
- `POST /api/doctors`: Create a new doctor (ADMIN only).
- `GET /api/doctors/:id/slots`: Fetch available time slots for a doctor.
- `POST /api/doctors/slots`: Create new booking sessions (ADMIN only).

### Bookings
- `POST /api/appointments/book`: Atomically book a seat (Authorization required).
- `PATCH /api/appointments/:id/confirm`: Finalize a pending booking.
- `GET /api/appointments/my-bookings`: Retrieve user's booking history.

---

## 🏛️ Architecture & Scaling
For detailed insights into how this system scales to handle high concurrency and production-grade loads, please refer to:
[ARCHITECTURE.md](./ARCHITECTURE.md)
