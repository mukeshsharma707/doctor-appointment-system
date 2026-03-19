require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Slot = require('./models/Slot');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/doctor_appointment');

    // ✅ SAFE SEEDING: Only insert admin user if none exists (never wipes data)
    const existingAdmin = await User.findOne({ email: 'admin@medbook.com' });
    if (!existingAdmin) {
      console.log('Creating admin user...');
      const admin = new User({ name: 'Admin', email: 'admin@medbook.com', password: 'password123', role: 'ADMIN' });
      await admin.save();
      console.log('Admin created: admin@medbook.com / password123');
    } else {
      console.log('Admin already exists. Skipping creation.');
    }

    const existingUser = await User.findOne({ email: 'john@user.com' });
    if (!existingUser) {
      console.log('Creating sample user...');
      const user = new User({ name: 'John Doe', email: 'john@user.com', password: 'password123', role: 'USER' });
      await user.save();
      console.log('User created: john@user.com / password123');
    } else {
      console.log('Sample user already exists. Skipping creation.');
    }

    // ✅ Only seed doctors if there are NONE in the database
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      console.log('No doctors found. Seeding sample doctors...');
      const docs = [
        { name: 'Sarah Johnson', specialty: 'Cardiologist', clinicName: 'HeartCare Center', photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=200', experience: 12 },
        { name: 'Michael Chen', specialty: 'Neurologist', clinicName: 'Neuro Science Hub', photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', experience: 15 },
        { name: 'Emily Davis', specialty: 'Pediatrician', clinicName: 'Kids Health First', photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200', experience: 8 }
      ];
      
      for (const d of docs) {
        const doc = new Doctor(d);
        await doc.save();
        
        const slot1 = new Slot({
          doctorId: doc._id,
          doctorName: doc.name,
          startTime: new Date(Date.now() + 86400000), // Tomorrow
          totalSeats: 40,
          availableSeats: 40
        });
        const slot2 = new Slot({
          doctorId: doc._id,
          doctorName: doc.name,
          startTime: new Date(Date.now() + 172800000), // Day after
          totalSeats: 40,
          availableSeats: 40
        });
        await slot1.save();
        await slot2.save();
      }
      console.log('Sample doctors and slots created!');
    } else {
      console.log(`Database already has ${doctorCount} doctor(s). Skipping doctor seeding to preserve your data.`);
    }

    console.log('\n✅ Seed complete! Your existing data is safe.');
    console.log('Admin: admin@medbook.com / password123');
    console.log('User: john@user.com / password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
