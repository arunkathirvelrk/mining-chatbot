import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState("register"); // register | verify

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔥 STEP 1: REGISTER + SEND OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await authService.register(formData);

            // Store email for verification
            localStorage.setItem('verifyEmail', formData.email);

            setMessage('OTP sent to your email. Please verify.');
            setStep("verify"); // 👈 SWITCH TO OTP VIEW (NO REDIRECT)

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // 🔥 STEP 2: VERIFY OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setError('');
        setMessage('');

        try {
            await axios.post("http://127.0.0.1:8000/auth/verify-email", {
                email: formData.email,
                otp: otp
            });

            setMessage("Email verified successfully! Redirecting to login...");

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Invalid or expired OTP"
            );
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className="auth-container" style={{ flex: 1 }}>
                <div className="auth-card">

                    {/* HEADER */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                            className="auth-icon-box"
                            style={{ background: 'transparent', width: '80px', height: '80px' }}
                        >
                            <img
                                src="/logo.png"
                                alt="MineLex Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>

                        <h2 style={{
                            fontSize: '1.65rem',
                            fontWeight: 800,
                            marginBottom: '0.4rem',
                            letterSpacing: '-0.04em',
                            color: 'var(--text-main)',
                            textAlign: 'center'
                        }}>
                            {step === "register" ? "Create Your MineLex Account" : "Verify Your Email"}
                        </h2>

                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            fontWeight: 500
                        }}>
                            {step === "register"
                                ? "Join the network of mining legal professionals"
                                : `Enter the OTP sent to ${formData.email}`}
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    {/* SUCCESS */}
                    {message && (
                        <div className="success-box">
                            {message}
                        </div>
                    )}

                    {/* 🧾 REGISTER FORM */}
                    {step === "register" && (
                        <form onSubmit={handleSubmit} className="fade-in">
                            <div className="form-group">
                                <label>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary)',
                                        opacity: 0.7,
                                        zIndex: 2
                                    }} />
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        placeholder="Create Your UserName"
                                        style={{ paddingLeft: '3.2rem' }}
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary)',
                                        opacity: 0.7,
                                        zIndex: 2
                                    }} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Enter Your Email"
                                        style={{ paddingLeft: '3.2rem' }}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary)',
                                        opacity: 0.7,
                                        zIndex: 2
                                    }} />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        style={{ paddingLeft: '3.2rem' }}
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button className="btn-auth" type="submit" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Create Account'} <UserPlus size={18} />
                            </button>
                        </form>
                    )}

                    {/* 🔐 OTP VERIFICATION FORM (SAME PAGE) */}
                    {step === "verify" && (
                        <form onSubmit={handleVerifyOtp} className="fade-in">
                            <div className="form-group">
                                <label>Enter 6-Digit OTP</label>
                                <div style={{ position: 'relative', marginTop: '1rem' }}>
                                    <ShieldCheck size={18} style={{
                                        position: 'absolute',
                                        left: '20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary)',
                                        opacity: 0.7,
                                        zIndex: 2
                                    }} />
                                    <input
                                        type="text"
                                        maxLength={6}
                                        required
                                        placeholder="------"
                                        style={{
                                            paddingLeft: '3.5rem',
                                            textAlign: 'center',
                                            letterSpacing: '12px',
                                            fontSize: '22px',
                                            fontWeight: 800,
                                            height: '64px'
                                        }}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button className="btn-auth" type="submit" disabled={verifying}>
                                {verifying ? 'Verifying OTP...' : 'Verify & Continue'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <span
                                    onClick={() => setStep("register")}
                                    style={{ color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Back to Registration
                                </span>
                            </div>
                        </form>
                    )}

                    <div className="auth-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;