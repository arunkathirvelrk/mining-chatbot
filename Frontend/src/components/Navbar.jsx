import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { User, LogOut, Menu, Sun, Moon, MessageSquare, History } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        setIsDark(theme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDark(!isDark);
    };

    const email = localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav style={{
            height: '70px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100,
            position: 'relative'
        }}>
            {/* Left Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <button
                    className="icon-btn mobile-only-flex"
                    onClick={onMenuClick}
                    style={{
                        marginRight: '0.5rem',
                        display: 'none'
                    }}
                >
                    <Menu size={20} />
                </button>

                <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: 'var(--primary)',
                    letterSpacing: '0.1em',
                    fontFamily: "'Space Grotesk', sans-serif"
                }}>
                    MINELEX
                </div>
            </div>

            {/* Center Section - Navigation Tabs */}
            <div className="nav-tabs-wrapper" style={{
                display: 'flex',
                background: 'var(--bg-secondary)',
                padding: '4px',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
            }}>
                <NavLink
                    to="/chat"
                    className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <MessageSquare size={16} />
                    <span>Chat</span>
                </NavLink>
                <NavLink
                    to="/history"
                    className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <History size={16} />
                    <span>History</span>
                </NavLink>
            </div>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, justifyContent: 'flex-end' }}>

                <button
                    className="icon-btn-utility"
                    onClick={toggleTheme}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    style={{ width: '40px', height: '40px', borderRadius: '12px' }}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            borderRadius: '14px',
                            transition: 'all 0.2s',
                            background: showDropdown ? 'var(--border-light)' : 'transparent'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <User size={20} />
                        </div>
                        <div style={{ textAlign: 'left' }} className="hide-mobile">
                            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{email?.split('@')[0]}</p>
                        </div>
                    </div>

                    {showDropdown && (
                        <>
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                                onClick={() => setShowDropdown(false)}
                            />
                            <div className="glass-card" style={{
                                position: 'absolute',
                                top: 'calc(100% + 12px)',
                                right: 0,
                                width: '180px',
                                padding: '0.4rem',
                                borderRadius: '12px',
                                zIndex: 100,
                                animation: 'fadeIn 0.2s ease-out'
                            }}>
                                <button className="dropdown-item" onClick={handleLogout} style={{ color: '#ef4444', width: '100%', border: 'none', background: 'transparent', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
