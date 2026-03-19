import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Stethoscope } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <Stethoscope size={32} color="#0F4C81" />
        <h2 style={{ margin: 0 }}>MedBook</h2>
      </Link>
      <nav>
        <Link to="/">Doctors</Link>
        {user ? (
          <>
            <Link to="/dashboard">My Bookings</Link>
            {user.role === 'ADMIN' && <Link to="/admin">Admin Panel</Link>}
            <span style={{ marginLeft: '2rem', fontWeight: 600, color: '#4A5568' }}>
              Hi, {user.name}
            </span>
            <button onClick={handleLogout} className="btn-logout" style={{ background: 'none', border: 'none', cursor: 'pointer', verticalAlign: 'middle', marginLeft: '1rem' }}>
              <LogOut size={20} color="#718096" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ color: 'white', marginLeft: '1.5rem' }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
