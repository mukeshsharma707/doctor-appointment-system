# System Architecture & Design Document

## 1. High-Level Architecture
The MedBook Doctor Appointment System is designed as a modern, decoupled web application built on the **MERN** stack (MongoDB, Express, React, Node.js). It follows a RESTful API architectural style.

### Key Components:
- **Client (Frontend)**: React.js application using Vite for optimized builds. It implements a premium Healthcare UI Design System with soft hues and glassmorphism.
- **Server (Backend)**: Express.js server handling authentication, business logic, and database interactions.
- **Database (MongoDB)**: Used for high-volume, performance-critical data storage such as slot seats and appointment records.
- **Background Worker**: A `node-cron` service that monitors appointment statuses and handles booking expirations (PENDING -> FAILED).

---

## 2. Concurrency Control Mechanisms
To handle **2,500+ concurrent candidates** and prevent overbooking (where multiple users book the same last available seat), the system implements **Atomic Database Operations**.

### Optimization Logic:
Instead of "Read -> Check -> Update", which is prone to race conditions, we use MongoDB's atomic `findOneAndUpdate`:

```javascript
const slot = await Slot.findOneAndUpdate(
    { _id: slotId, availableSeats: { $gt: 0 } },  // Filter to ensure availability
    { $inc: { availableSeats: -1 } },              // Atomic decrement
    { new: true }                                   // Return updated document
);
```

**Why this works:**
- MongoDB executes this operation as a single atomic unit.
- If multiple requests arrive for the last seat (1), only the first one to reach the database engine will match the `{ $gt: 0 }` condition.
- Subsequent requests will return `null`, allowing us to send a `409 Conflict` response to those users, effectively preventing overbooking without expensive application-level locking.

---

## 3. Database Scaling Strategy
For a production-grade application like RedBus or BookMyShow, we would implement:

### a) Sharding
We should shard the `Appointments` and `Slots` collections based on `doctorId` or `locationId`. This distributes the load across multiple physical nodes, ensuring that a surge in bookings for one doctor doesn't impact others.

### b) Read/Write Splitting
Implement **Replica Sets**. Use the Primary node for all booking transactions (writes) and secondary nodes for listing doctors and viewing schedules (reads). This significantly increases throughput for the most common user action: "Browsing".

### c) Indexing
Critical indexes:
- `slotId` on `Appointments` (for status checks).
- `startTime` and `doctorId` on `Slots` (for fast searching).
- `email` on `Users` (for authentication).

---

## 4. Caching Strategy
To maintain performance during heavy traffic (e.g., when 2,500 people try to book at the same time):

- **Redis for Hot Slots**: Store the current seat count of popular doctors in Redis. Use Lua scripts in Redis to atomically decrement seat counts. This is even faster than MongoDB for high-frequency updates.
- **CDN for Frontend**: Host the React app on a CDN (Vercel/Cloudflare) to ensure fast load times globally.

---

## 5. Message Queues (Optional Bonus)
For extreme scale, use **RabbitMQ** or **Kafka**:
1.  **Request Buffering**: Instead of processing bookings synchronously, push booking requests into a queue.
2.  **Notification Engine**: Decouple email/SMS notifications for confirmed bookings from the main API response cycle.

---

## 6. Booking Expiry
The system implements a background worker that cleans up "Abandoned" bookings:
- Every minute, it scans for appointments in `PENDING` status older than 2 minutes.
- It atomically increments the `availableSeats` back into the slot pool.
- Marks the appointment as `FAILED`.
- This ensures that stagnant sessions don't block other genuine users from booking.
