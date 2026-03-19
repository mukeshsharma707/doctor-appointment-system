import React from 'react';
import { Heart, Mail, Phone, MapPin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ marginTop: '5rem', padding: '4rem 2rem 2rem', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                
                {/* Brand Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                        <Heart fill="var(--primary)" size={24} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>MedBook</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Connecting patients with top-tier medical specialists through a seamless, high-concurrency booking experience.
                    </p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '1.5rem' }}>
                        <Facebook size={20} color="var(--primary)" style={{ cursor: 'pointer' }} />
                        <Twitter size={20} color="var(--primary)" style={{ cursor: 'pointer' }} />
                        <Instagram size={20} color="var(--primary)" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Quick Navigation</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem', cursor: 'pointer' }}>Search Specialists</li>
                        <li style={{ marginBottom: '0.8rem', cursor: 'pointer' }}>Manage Appointments</li>
                        <li style={{ marginBottom: '0.8rem', cursor: 'pointer' }}>Medical Dashboard</li>
                        <li style={{ marginBottom: '0.8rem', cursor: 'pointer' }}>Privacy Policy</li>
                    </ul>
                </div>

                {/* Reach Us */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Contact Central</h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Phone size={16} color="var(--primary)" /> +1 (555) 900-MED-CALL
                        </li>
                        <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Mail size={16} color="var(--primary)" /> support@medbook.healthcare
                        </li>
                        <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={16} color="var(--primary)" /> 42nd Medical Plaza, NY 10001
                        </li>
                    </ul>
                </div>

                {/* Opening Hours */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Service Hours</h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Mon - Fri:</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>08:00 - 22:00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Saturday:</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>09:00 - 18:00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Sunday:</span>
                            <span style={{ color: 'var(--error)', fontWeight: 600 }}>Emergency Only</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div style={{ borderTop: '1px solid #eee', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <p>&copy; {new Date().getFullYear()} MedBook Healthcare System. All rights reserved.</p>
                <div style={{ marginTop: '10px', fontSize: '0.7rem' }}>
                    Built with Concurrency, Security, and Care.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
