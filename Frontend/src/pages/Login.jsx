import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogIn, ArrowLeft, Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [authMode, setAuthMode] = useState("login"); // login | forgot | reset
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [isDark, setIsDark] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // 🌙 Theme detection
    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDark(theme !== 'light');
        };

        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔐 LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const data = await authService.login({
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('email', formData.email);
            localStorage.setItem('role', data.role || 'user');
            localStorage.setItem('provider', 'local');

            navigate('/chat');
        } catch (err) {
            const backendError = err.response?.data?.detail;
            if (typeof backendError === "string") {
                setError(backendError);
            } else {
                setError('Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    // 📩 SEND OTP
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.post(
                "http://127.0.0.1:8000/auth/forgot-password",
                { email: formData.email }
            );

            setMessage("OTP sent to your email. Please check your inbox.");
            setAuthMode("reset");

        } catch (err) {
            const backendError = err.response?.data?.detail;
            setError(typeof backendError === "string" ? backendError : "Email not registered");
        } finally {
            setLoading(false);
        }
    };

    // 🔄 RESET PASSWORD (OTP)
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!formData.otp || formData.otp.length !== 6) {
            setError("Enter valid 6-digit OTP");
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/auth/reset-password",
                {
                    email: formData.email,
                    otp: formData.otp,
                    new_password: formData.newPassword
                }
            );

            setMessage("Password reset successful! Redirecting to login...");

            setFormData({
                email: formData.email,
                password: '',
                otp: '',
                newPassword: '',
                confirmPassword: ''
            });

            // 🔥 Auto return to login
            setTimeout(() => {
                setAuthMode("login");
                setMessage("");
                setError("");
            }, 2000);

        } catch (err) {
            const backendError = err.response?.data?.detail;
            if (Array.isArray(backendError)) {
                setError(backendError[0]?.msg || "Validation error");
            } else if (typeof backendError === "string") {
                setError(backendError);
            } else {
                setError("Reset failed. Invalid or expired OTP.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 🌐 GOOGLE LOGIN
    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);
        setError('');

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/auth/google-login",
                { token: credentialResponse.credential }
            );

            const user = res.data.user;
            localStorage.setItem('email', user.email);
            localStorage.setItem('provider', 'google');

            navigate('/chat');
        } catch (error) {
            setError("Google login failed");
        } finally {
            setGoogleLoading(false);
        }
    };

    const getTitle = () => {
        if (authMode === "forgot") return "Forgot Password";
        if (authMode === "reset") return "Reset Password";
        return "Welcome Back";
    };

    const getSubtitle = () => {
        if (authMode === "forgot") return "Enter your email to receive OTP";
        if (authMode === "reset") return "Enter OTP and new password";
        return "Access your mining intelligence dashboard";
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className="auth-container" style={{ flex: 1 }}>
                <div className="auth-card">

                    {/* HEADER */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <img src="/logo.png" alt="MineLex Logo" style={{ width: 70, marginBottom: '0.8rem' }} />
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{getTitle()}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {getSubtitle()}
                        </p>
                    </div>

                    {/* ERROR / SUCCESS */}
                    {error && <div className="error-box">{error}</div>}
                    {message && <div className="success-box">{message}</div>}

                    {/* 🔐 LOGIN FORM */}
                    {authMode === "login" && (
                        <>
                            <form onSubmit={handleLogin}>
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
                                            placeholder="Your Email"
                                            style={{ paddingLeft: '3.2rem', height: '54px' }}
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ position: 'relative' }}>
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
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            style={{ paddingLeft: '3.2rem', height: '54px' }}
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                                    <span
                                        style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}
                                        onClick={() => setAuthMode("forgot")}
                                    >
                                        Forgot Password?
                                    </span>
                                </div>

                                <button className="btn-auth" type="submit" disabled={loading} style={{ height: '54px' }}>
                                    {loading ? "Authenticating..." : "Sign In"} <LogIn size={18} />
                                </button>
                            </form>

                            {/* 🌐 PREMIUM GOOGLE LOGIN */}
                            <div style={{ marginTop: '1.8rem', textAlign: 'center' }}>
                                <p
                                    style={{
                                        marginBottom: '14px',
                                        color: 'var(--text-muted)',
                                        fontWeight: 600,
                                        letterSpacing: '0.5px',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    OR CONTINUE WITH
                                </p>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        width: '100%'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            maxWidth: '360px',
                                            padding: '6px',
                                            borderRadius: '999px',
                                            background: isDark
                                                ? 'rgba(255,255,255,0.04)'
                                                : 'rgba(0,0,0,0.03)',
                                            backdropFilter: 'blur(8px)',
                                            boxShadow: isDark
                                                ? '0 8px 25px rgba(0,0,0,0.35)'
                                                : '0 8px 20px rgba(0,0,0,0.08)',
                                            transition: 'all 0.25s ease'
                                        }}
                                    >
                                        {googleLoading ? (
                                            <button
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '999px',
                                                    padding: '12px',
                                                    border: 'none',
                                                    fontWeight: 600,
                                                    background: isDark ? '#1f2937' : '#ffffff',
                                                    color: 'var(--text-primary)',
                                                    cursor: 'not-allowed'
                                                }}
                                                disabled
                                            >
                                                Signing in with Google...
                                            </button>
                                        ) : (
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={() => setError("Google Login Failed")}
                                                theme={isDark ? "filled_black" : "outline"}
                                                size="large"
                                                shape="pill"
                                                text="continue_with"
                                                width="100%"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* CREATE ACCOUNT */}
                            <div style={{
                                marginTop: '1.8rem',
                                paddingTop: '1.2rem',
                                borderTop: '1px solid rgba(148, 163, 184, 0.15)',
                                textAlign: 'center',
                                fontSize: '0.9rem'
                            }}>
                                Don’t have an account?
                                <span
                                    onClick={() => navigate('/register')}
                                    style={{
                                        color: '#10b981',
                                        fontWeight: 700,
                                        marginLeft: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Create Account →
                                </span>
                            </div>
                        </>
                    )}

                    {/* 📩 FORGOT PASSWORD */}
                    {authMode === "forgot" && (
                        <form onSubmit={handleForgotPassword}>
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
                                        placeholder="name@company.com"
                                        style={{ paddingLeft: '3.2rem', height: '54px' }}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button className="btn-auth" type="submit" disabled={loading} style={{ height: '54px' }}>
                                {loading ? "Sending OTP..." : "Recieve OTP via Email"}
                            </button>

                            <p
                                style={{ marginTop: '1.2rem', cursor: 'pointer', fontWeight: 600 }}
                                onClick={() => setAuthMode("login")}
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </p>
                        </form>
                    )}

                    {/* 🔄 RESET PASSWORD */}
                    {authMode === "reset" && (
                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label>Verify OTP</label>
                                <div style={{ position: 'relative' }}>
                                    <ShieldCheck size={18} style={{
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
                                        name="otp"
                                        maxLength={6}
                                        placeholder="6-digit code"
                                        style={{ paddingLeft: '3.2rem', height: '54px', letterSpacing: '2px', fontWeight: 700 }}
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
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
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        placeholder="New password"
                                        style={{ paddingLeft: '3.2rem', height: '54px' }}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)'
                                        }}
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
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
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Repeat password"
                                        style={{ paddingLeft: '3.2rem', height: '54px' }}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)'
                                        }}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </span>
                                </div>
                            </div>

                            <button className="btn-auth" type="submit" disabled={loading} style={{ height: '54px', marginTop: '1rem' }}>
                                {loading ? "Resetting..." : "Reset Password Now"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;