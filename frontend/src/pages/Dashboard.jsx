import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/appointments/my-bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) { console.error(err); }
        };
        fetchBookings();
    }, []);

    const handleConfirm = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/appointments/${id}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookings.map(b => b._id === id ? { ...b, status: 'CONFIRMED' } : b));
        } catch (err) { alert('Confirmation failed'); }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/appointments/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookings.map(b => b._id === id ? { ...b, status: 'CANCELED' } : b));
        } catch (err) { alert('Cancellation failed'); }
    };

    return (
        <div style={{ marginTop: '3rem' }}>
            <h1>My Activity Center</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your pending and confirmed doctor visits.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '2rem' }}>
                {bookings.length === 0 && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <AlertCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                        <p>No bookings found yet. Start by exploring doctors!</p>
                    </div>
                )}
                {bookings.map(booking => (
                    <div key={booking._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <User size={20} color="var(--primary)" />
                                <div>
                                    <div style={{ fontWeight: 700 }}>{booking.slotId ? `Dr. ${booking.slotId.doctorName}` : 'Doctor Retired'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {booking._id}</div>
                                </div>
                            </div>
                            {booking.slotId ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={18} />
                                        <span>{new Date(booking.slotId.startTime).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Clock size={18} />
                                        <span>{new Date(booking.slotId.startTime).toLocaleTimeString()}</span>
                                    </div>
                                </>
                            ) : (
                                <div style={{ color: 'var(--error)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <AlertCircle size={16} /> Session Timing Unavailable
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                                {booking.status}
                            </span>
                            {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {booking.status === 'PENDING' && (
                                        <button className="btn btn-primary" onClick={() => handleConfirm(booking._id)}>
                                            Finalize
                                        </button>
                                    )}
                                    <button className="btn" style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }} onClick={() => handleCancel(booking._id)}>
                                        Cancel
                                    </button>
                                    <button className="btn" style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }} onClick={() => navigate(`/?reschedule=${booking._id}`)}>
                                        Reschedule
                                    </button>
                                </div>
                            )}
                            {booking.status === 'CANCELED' && <XCircle size={24} color="var(--text-muted)" />}
                            {booking.status === 'FAILED' && <XCircle size={24} color="var(--error)" />}
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#718096', padding: '1rem', borderTop: '1px solid #eee' }}>
                * All PENDING bookings expire after 2 minutes of inactivity as per system policy.
            </div>
        </div>
    );
};

export default Dashboard;
