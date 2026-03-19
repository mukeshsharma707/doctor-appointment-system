const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    startTime: { type: Date, required: true },
    totalSeats: { type: Number, required: true, default: 40 },
    availableSeats: { type: Number, required: true, default: 40 },
    version: { type: Number, default: 0 } // Optimistic locking if we need it, but findAndModify is enough
});

module.exports = mongoose.model('Slot', slotSchema);
