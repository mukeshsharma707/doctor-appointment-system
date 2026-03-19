import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are in Reschedule Mode
  const query = new URLSearchParams(location.search);
  const rescheduleApptId = query.get('reschedule');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
        setDoctors(res.data);
      } catch (err) { console.error('Error fetching doctors:', err); }
    };
    fetchDoctors();
  }, []);

  const handleFetchSlots = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/${doctor._id}/slots`);
      setSlots(res.data);
    } catch (err) { console.error('Error fetching slots:', err); }
  };

  const handleBook = async (slotId) => {
    if (!user) {
      alert('Please login to book an appointment');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      
      if (rescheduleApptId) {
        // RESCHEDULE LOGIC
        await axios.patch(`${import.meta.env.VITE_API_URL}/appointments/${rescheduleApptId}/reschedule`, 
          { newSlotId: slotId }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Appointment rescheduled successfully!');
        navigate('/dashboard');
      } else {
        // NORMAL BOOKING LOGIC
        await axios.post(`${import.meta.env.VITE_API_URL}/appointments/book`, 
          { slotId }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Booking request successful! Status: PENDING.');
        navigate('/dashboard');
      }
      
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Sorry! The slot is now full.');
      } else {
        alert('Error processing request.');
      }
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {rescheduleApptId && (
        <div style={{ background: '#EBF8FF', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #BEE3F8', color: '#2C5282', fontWeight: 600 }}>
          🔄 You are currently rescheduling your appointment. Please select a new slot.
          <button onClick={() => navigate('/')} style={{ marginLeft: '1rem', border: 'none', background: 'none', color: '#2C5282', textDecoration: 'underline', cursor: 'pointer' }}>Cancel Rescheduling</button>
        </div>
      )}
      <h1>Available Doctors</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {doctors.map(doc => (
          <div key={doc._id} className="glass-card" onClick={() => handleFetchSlots(doc)} style={{ cursor: 'pointer', border: selectedDoctor?._id === doc._id ? '2px solid var(--primary)' : '1px solid transparent', textAlign: 'center' }}>
            <img src={doc.photoUrl} alt={doc.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '2px solid #eee' }} />
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.2rem' }}>Dr. {doc.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{doc.specialty}</p>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, margin: '4px 0' }}>{doc.experience || 0}+ Years of Experience</div>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{doc.clinicName}</p>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div style={{ marginTop: '4rem' }}>
          <h2>Available Slots for Dr. {selectedDoctor.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {slots.length === 0 ? (
              <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
                <h3 style={{ color: '#C53030', margin: 0 }}>Dr. {selectedDoctor.name} is not available</h3>
                <p style={{ color: '#742A2A', marginTop: '0.5rem' }}>Please check back later for new session timings.</p>
              </div>
            ) : (
              slots.map(slot => (
                <div key={slot._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                      <Calendar size={18} color="var(--primary)" />
                      <span>{new Date(slot.startTime).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} color="var(--primary)" />
                      <span>{new Date(slot.startTime).toLocaleTimeString()}</span>
                    </div>
                    <div style={{ marginTop: '1rem', fontWeight: 700, color: slot.availableSeats > 0 ? 'var(--success)' : 'var(--error)' }}>
                      Seats: {slot.availableSeats} / {slot.totalSeats}
                    </div>
                  </div>
                  <button 
                    className={`btn ${slot.availableSeats > 0 ? 'btn-primary' : ''}`} 
                    disabled={slot.availableSeats <= 0}
                    onClick={() => handleBook(slot._id)}
                    style={{ backgroundColor: slot.availableSeats <= 0 ? '#E2E8F0' : 'var(--primary)' }}
                  >
                    {slot.availableSeats > 0 ? 'Book Fast' : 'Sold Out'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
