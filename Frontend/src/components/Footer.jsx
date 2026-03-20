import React from 'react';
import { Shield, Globe, Lock, Cpu } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            padding: '2rem',
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto',
            width: '100%'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <img src="/logo.png" alt="MineLex" style={{ width: '24px' }} />
                        <span style={{ fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.9rem', color: 'var(--primary)' }}>MINELEX ENGINEERING</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Advanced analytical matrix for mining legislation and regulatory compliance. Powered by sovereign intelligence.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Security</span>
                        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Data Sovereignty</a>
                        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>Resources</span>
                        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Documentation</a>
                        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}>API Access</a>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>© 2026 MINELEX PORTAL. ALL SYSTEMS OPERATIONAL.</p>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--primary)', opacity: 0.6 }}>
                    <Globe size={14} />
                    <Cpu size={14} />
                    <Shield size={14} />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
