import React, { useState, useEffect, useCallback } from 'react';
import { adminService, chatService } from '../services/api';
import { Upload, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import { groupHistoryByDate } from '../services/utils';
import { useChat } from '../context/ChatContext';

const Admin = () => {
    const { chatIdRef, newChat, loadChat } = useChat();
    const email = localStorage.getItem('email');

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const [historyItems, setHistoryItems] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        if (!email) return;
        try {
            const data = await chatService.getHistory(email.toLowerCase());
            setHistoryItems(Array.isArray(data) ? data : []);
        } finally {
            setHistoryLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setStatus({ type: '', message: '' });
        } else {
            setFile(null);
            setStatus({ type: 'error', message: 'Please select a valid PDF file' });
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await adminService.uploadFile(file);
            setStatus({ type: 'success', message: 'Document synchronized to intelligence core.' });
            setFile(null);
            if (document.getElementById('file-upload')) {
                document.getElementById('file-upload').value = '';
            }
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.detail || 'System error during upload.' });
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        newChat();
    };

    const handleHistoryClick = (chat) => {
        loadChat(chat.chat_id, chat.messages);
    };

    return (
        <Layout
            sidebarContent={
                <Sidebar
                    groupedItems={groupHistoryByDate(historyItems)}
                    selectedChatId={chatIdRef.current}
                    onNewChat={handleNewChat}
                    onItemSelect={handleHistoryClick}
                    loading={historyLoading}
                />
            }
        >
            <div style={{ flex: 1, overflow: 'auto' }}>
                <div className="fade-in" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                    <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                        <span style={{
                            color: 'var(--primary)',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3em',
                            display: 'block',
                            marginBottom: '1.25rem',
                            fontFamily: "'Space Grotesk', sans-serif"
                        }}>Intelligence Administration</span>
                        <h1 style={{
                            fontSize: '3.5rem',
                            fontWeight: 800,
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.06em',
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: 'var(--text-primary)'
                        }}>
                            Knowledge<span style={{ color: 'var(--primary)' }}>Base</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
                            Upload and synchronize official mining regulations, technical manuals, and legal documentation to the global intelligence core.
                        </p>
                    </div>

                    <div style={{
                        maxWidth: '650px',
                        margin: '0 auto',
                        padding: '3.5rem',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-xl)',
                        border: '2px dashed var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {!file ? (
                            <>
                                <div style={{
                                    background: 'var(--primary-glow)',
                                    color: 'var(--primary)',
                                    padding: '2rem',
                                    borderRadius: '32px',
                                    marginBottom: '2.5rem',
                                    boxShadow: 'var(--shadow-premium)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Upload size={54} strokeWidth={1.5} />
                                    <div className="shimmer" />
                                </div>
                                <h3 style={{ marginBottom: '1rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>New Synchronization</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '3rem', fontWeight: 500 }}>
                                    Select PDF files for semantic vector analysis
                                </p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="btn-primary"
                                    style={{
                                        padding: '1rem 3.5rem',
                                        fontSize: '1.1rem',
                                        borderRadius: '16px',
                                        fontFamily: "'Space Grotesk', sans-serif"
                                    }}
                                >
                                    Select Documents
                                </label>
                            </>
                        ) : (
                            <div style={{ width: '100%' }}>
                                <div className="glass-card" style={{
                                    padding: '1.75rem',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    marginBottom: '2.5rem',
                                }}>
                                    <div style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        padding: '1.25rem',
                                        borderRadius: '16px',
                                        boxShadow: 'var(--shadow-md)'
                                    }}>
                                        <FileText size={32} />
                                    </div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{file.name}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontWeight: 600 }}>{(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR ANALYSIS</p>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            color: '#ef4444',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <button
                                    className="btn-primary"
                                    onClick={handleUpload}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        height: '58px',
                                        fontSize: '1.15rem',
                                        borderRadius: '18px',
                                        boxShadow: 'var(--shadow-lg)'
                                    }}
                                >
                                    {loading ? 'Analyzing Vector Structure...' : 'Initiate Global Sync'}
                                </button>
                            </div>
                        )}

                        {status.message && (
                            <div style={{
                                marginTop: '2.5rem',
                                padding: '1.25rem',
                                borderRadius: 'var(--radius-md)',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                backgroundColor: status.type === 'success' ? 'var(--primary-light)' : '#fee2e2',
                                color: status.type === 'success' ? 'var(--primary)' : '#991b1b',
                                border: `1px solid ${status.type === 'success' ? 'var(--primary-glow)' : '#fecaca'}`,
                            }}>
                                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {status.message}
                            </div>
                        )}
                    </div>

                    <div style={{
                        maxWidth: '650px',
                        margin: '4rem auto 0 auto',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)'
                    }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                            <AlertCircle size={20} style={{ color: 'var(--primary)' }} />
                            Protocol Specifications
                        </h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'grid', gap: '0.75rem' }}>
                            <p>• Ensure documents are digitally encoded (searchable text).</p>
                            <p>• Vector indexing occurs in real-time upon successful transmission.</p>
                            <p>• Large datasets may require several minutes for full semantic analysis.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Admin;
