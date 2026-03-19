import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, UserPlus, CalendarPlus, Trash2, Edit } from 'lucide-react';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    
    // Doctor form
    const [docName, setDocName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [clinic, setClinic] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [experience, setExperience] = useState('');

    // Slot form
    const [selectedDocId, setSelectedDocId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [seats, setSeats] = useState(40);

    const fetchDoctors = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
        setDoctors(res.data);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleEditDoctor = (doctor) => {
        setEditingId(doctor._id);
        setDocName(doctor.name);
        setSpecialty(doctor.specialty);
        setClinic(doctor.clinicName);
        setPhotoUrl(doctor.photoUrl);
        setExperience(doctor.experience || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteDoctor = async (id) => {
        const apiURL = 'http://localhost:5001/api'; // Hardcoded for reliability during testing
        console.log(`Starting delete process for Doctor ID: ${id}`);
        console.log(`Targeting URL: ${apiURL}/doctors/${id}`);
        
        if (!window.confirm('Are you sure? All associated slots will be deleted.')) return;
        
        try {
            const token = localStorage.getItem('token');
            console.log(`Token Presence: ${token ? 'Token Found' : 'Token MISSING'}`);
            
            const response = await axios.delete(`${apiURL}/doctors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Delete Response Status:', response.status);
            console.log('Delete Response Data:', response.data);
            
            setDoctors(doctors.filter(d => d._id !== id));
            alert('Doctor profile removed.');
        } catch (err) { 
            console.error('DELETE FAILED:', err);
            if (err.response) {
                console.error('Error Data:', err.response.data);
                console.error('Error Status:', err.response.status);
            }
            alert(`Delete failed: ${err.message}`); 
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const doctorData = { name: docName, specialty, clinicName: clinic, photoUrl, experience: Number(experience) };
            
            if (editingId) {
                const res = await axios.put(`${import.meta.env.VITE_API_URL}/doctors/${editingId}`, doctorData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(doctors.map(d => d._id === editingId ? res.data : d));
                alert('Doctor profile updated!');
                setEditingId(null);
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/doctors`, doctorData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors([...doctors, res.data]);
                alert('Doctor profile created!');
            }
            setDocName(''); setSpecialty(''); setClinic(''); setPhotoUrl(''); setExperience('');
        } catch (err) { alert('Action failed.'); }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/doctors/slots`, 
                { doctorId: selectedDocId, startTime, totalSeats: seats },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Slot sessions published successfully!');
            setStartTime(''); setSeats(40);
        } catch (err) { alert('Slot creation failed.'); }
    };

    if (!user || user.role !== 'ADMIN') return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><h1>Access Denied</h1><p>You need administrative privileges to view this page.</p></div>;

    return (
        <div style={{ marginTop: '3rem' }}>
            <h1>Hospital Admin Control</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage doctor profiles and session timings.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {/* Doctor Setup Card */}
                <div className="glass-card">
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={20} color="var(--primary)" />
                        {editingId ? 'Edit Doctor Profile' : 'Register New Doctor'}
                    </h3>
                    <form onSubmit={handleAddDoctor} style={{ marginTop: '1.5rem' }}>
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input type="text" value={docName} onChange={e => setDocName(e.target.value)} placeholder="Dr. Name" required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Medical Specialty</label>
                            <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="e.g. Cardiologist" required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Clinic / Hospital Name</label>
                            <input type="text" value={clinic} onChange={e => setClinic(e.target.value)} placeholder="MedCenter Hospital" required />
                        </div>
                        
                        <div className="input-group">
                            <label className="input-label">Quick Avatars</label>
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {[
                                    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
                                    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
                                    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
                                    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=200',
                                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
                                ].map((url, idx) => (
                                    <img 
                                        key={idx} 
                                        src={url} 
                                        alt="Avatar" 
                                        onClick={() => setPhotoUrl(url)} 
                                        style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', border: photoUrl === url ? '3px solid var(--primary)' : '2px solid transparent' }} 
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Years of Experience</label>
                            <input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 15" required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Profile Photo URL</label>
                            <input type="text" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="Or paste any URL here" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            {editingId ? 'Save Changes' : 'Create Profile'}
                        </button>
                        {editingId && (
                            <button className="btn" style={{ width: '100%', marginTop: '0.5rem', background: '#eee' }} onClick={() => { setEditingId(null); setDocName(''); setSpecialty(''); setClinic(''); setPhotoUrl(''); }}>
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                {/* Manage Profiles List */}
                <div className="glass-card">
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Active Medical Profiles</h3>
                    <div style={{ marginTop: '1.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                        {doctors.map(d => (
                            <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f0f0f0' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Dr. {d.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.specialty}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleEditDoctor(d)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                                        <Edit size={18} color="var(--primary)" />
                                    </button>
                                    <button onClick={() => handleDeleteDoctor(d._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                                        <Trash2 size={20} color="var(--error)" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slot Management Card */}
                <div className="glass-card">
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarPlus size={20} color="var(--primary)" />
                        Publish Slot Session
                    </h3>
                    <form onSubmit={handleAddSlot} style={{ marginTop: '1.5rem' }}>
                        <div className="input-group">
                            <label className="input-label">Select Doctor</label>
                            <select value={selectedDocId} onChange={e => setSelectedDocId(e.target.value)} required>
                                <option value="">-- Choose Profile --</option>
                                {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Session Start Date & Time</label>
                            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Total Booking Capacity</label>
                            <input type="number" value={seats} onChange={e => setSeats(e.target.value)} min="1" max="1000" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Open Bookings</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
