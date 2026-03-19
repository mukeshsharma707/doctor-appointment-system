import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password, role });
      alert('Registration successful! please login now.');
      navigate('/login');
    } catch (err) { alert('Registration failed.'); }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto' }} className="glass-card">
      <h1 style={{ textAlign: 'center' }}>Account Setup</h1>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
        </div>
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        </div>
        <div className="input-group">
          <label className="input-label">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="USER">User (Standard)</option>
            <option value="ADMIN">Admin (Create Doctors/Slots)</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Get Started</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight:600 }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
