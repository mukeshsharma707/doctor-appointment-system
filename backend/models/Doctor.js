const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    clinicName: { type: String, required: true },
    photoUrl: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' },
    experience: { type: Number, default: 0 }
});

module.exports = mongoose.model('Doctor', doctorSchema);
