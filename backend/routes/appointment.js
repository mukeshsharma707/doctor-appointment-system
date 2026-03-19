const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const { auth } = require('../middleware/auth');

// Create Booking (High Concurrency Atomic Transaction)
router.post('/book', auth, async (req, res) => {
    try {
        const { slotId } = req.body;
        const userId = req.user.id;

        // Atomically check availability and decrement in one step
        // This is the core of concurrency handling to prevent overbooking
        const slot = await Slot.findOneAndUpdate(
            { _id: slotId, availableSeats: { $gt: 0 } }, // Condition: Must have seats
            { $inc: { availableSeats: -1 } },             // Action: Decrement available seats
            { new: true }                                  // Return the updated document
        );

        if (!slot) {
            // If no slot matches criteria (either ID not found or seats 0)
            return res.status(409).json({ msg: 'Slot full or unavailable' });
        }

        // Create the appointment in PENDING status
        const appointment = new Appointment({
            userId,
            slotId,
            status: 'PENDING'
        });
        await appointment.save();

        res.status(201).json({
            msg: 'Booking pending payment/completion',
            appointment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Confirm Booking
router.patch('/:id/confirm', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        if (appointment.userId.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });

        appointment.status = 'CONFIRMED';
        appointment.updatedAt = Date.now();
        await appointment.save();

        res.json({ msg: 'Booking confirmed', appointment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Appointments
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Appointment.find({ userId: req.user.id })
            .populate('slotId')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel Appointment
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        if (appointment.userId.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });
        if (appointment.status === 'CANCELED') return res.status(400).json({ msg: 'Already canceled' });

        appointment.status = 'CANCELED';
        appointment.updatedAt = Date.now();
        await appointment.save();

        // Increment seat back
        await Slot.findByIdAndUpdate(appointment.slotId, { $inc: { availableSeats: 1 } });

        res.json({ msg: 'Booking canceled', appointment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reschedule Appointment
router.patch('/:id/reschedule', auth, async (req, res) => {
    try {
        const { newSlotId } = req.body;
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });
        if (appointment.userId.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });

        const oldSlotId = appointment.slotId;

        // Atomically try to get a seat in the new slot
        const newSlot = await Slot.findOneAndUpdate(
            { _id: newSlotId, availableSeats: { $gt: 0 } },
            { $inc: { availableSeats: -1 } },
            { new: true }
        );

        if (!newSlot) return res.status(409).json({ msg: 'New slot is full' });

        // Update appointment
        appointment.slotId = newSlotId;
        appointment.updatedAt = Date.now();
        await appointment.save();

        // Increment seat in the old slot
        await Slot.findByIdAndUpdate(oldSlotId, { $inc: { availableSeats: 1 } });

        res.json({ msg: 'Booking rescheduled successfully', appointment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
