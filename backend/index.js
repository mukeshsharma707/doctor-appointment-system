require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const Appointment = require('./models/Appointment');
const Slot = require('./models/Slot');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor_appointment';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctor'));
app.use('/api/appointments', require('./routes/appointment'));

// Background Task: Mark PENDING as FAILED if older than 2 mins OR past start time
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    // 1. Cleanup expired PENDING appointments (2 min rule)
    const expiredPending = await Appointment.find({
        status: 'PENDING',
        createdAt: { $lt: twoMinutesAgo }
    });

    for (const appt of expiredPending) {
        await Slot.findByIdAndUpdate(appt.slotId, { $inc: { availableSeats: 1 } });
        appt.status = 'FAILED';
        await appt.save();
    }

    // 2. Auto-Cancel if Slot startTime has passed and not confirmed
    const appointments = await Appointment.find({ status: { $in: ['PENDING', 'CONFIRMED'] } }).populate('slotId');
    for (const appt of appointments) {
        if (appt.slotId && new Date(appt.slotId.startTime) < now) {
            console.log(`Auto-canceling past appointment: ${appt._id}`);
            appt.status = 'FAILED'; // or CANCELED
            await appt.save();
            // Note: We don't increment seats here because the time has passed anyway
        }
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
