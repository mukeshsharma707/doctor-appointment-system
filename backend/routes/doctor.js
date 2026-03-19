const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Slot = require('../models/Slot');
const { auth, isAdmin } = require('../middleware/auth');

router.use((req, res, next) => {
    console.log(`DOCTOR ROUTE: ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Create Doctor (Admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(201).json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Slot (Admin only)
router.post('/slots', [auth, isAdmin], async (req, res) => {
    try {
        const { doctorId, startTime, totalSeats } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if(!doctor) return res.status(404).json({ msg: 'Doctor not found' });

        const slot = new Slot({
            doctorId,
            doctorName: doctor.name,
            startTime,
            totalSeats,
            availableSeats: totalSeats
        });
        await slot.save();
        res.status(201).json(slot);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Slots for a Doctor
router.get('/:doctorId/slots', async (req, res) => {
    try {
        const slots = await Slot.find({ doctorId: req.params.doctorId });
        res.json(slots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Doctor (Admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!doctor) return res.status(404).json({ msg: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Doctor (Admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        console.log(`Deletng Doctor Request: ${req.params.id}`);
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if(!doctor) console.log('Doctor not found in DB');
        
        // Clean up associated slots
        const slotsRes = await Slot.deleteMany({ doctorId: req.params.id });
        console.log(`Removed ${slotsRes.deletedCount} slots for doctor ${req.params.id}`);
        
        res.json({ msg: 'Doctor and associated slots removed' });
    } catch (err) {
        console.error('Delete Route Error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
