import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert('Invalid login credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto' }} className="glass-card">
      <h1 style={{ textAlign: 'center' }}>Welcome Back</h1>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight:600 }}>Create One</Link>
      </p>
    </div>
  );
};

export default Login;
