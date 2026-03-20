import React, { useState, useEffect } from 'react';
import { chatService } from '../services/api';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import MessageBubble from '../components/MessageBubble';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { groupHistoryByDate } from '../services/utils';
import { useChat } from '../context/ChatContext';

const History = () => {
    const { loadChat, newChat } = useChat();
    const [historyItems, setHistoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await chatService.getHistory(email?.toLowerCase());
                setHistoryItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch history', err);
                setHistoryItems([]);
            } finally {
                setLoading(false);
            }
        };

        if (email) fetchHistory();
        else setLoading(false);
    }, [email]);

    const handleNewChat = () => {
        newChat();
        navigate('/chat');
    };

    const groupedItems = groupHistoryByDate(historyItems);

    const handleContinueChat = () => {
        if (!selectedItem) return;
        loadChat(selectedItem.chat_id, selectedItem.messages);
        navigate('/chat');
    };

    return (
        <Layout
            sidebarContent={
                <Sidebar
                    groupedItems={groupedItems}
                    selectedChatId={selectedItem?.chat_id}
                    onItemSelect={setSelectedItem}
                    loading={loading}
                    onNewChat={handleNewChat}
                />
            }
        >
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {selectedItem ? (
                    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="glass-card" style={{
                            padding: '1rem 2rem',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'var(--bg-glass)'
                        }}>
                            <div style={{ background: 'var(--primary-glow)', padding: '0.6rem', borderRadius: '12px', color: 'var(--primary)' }}>
                                <MessageSquare size={20} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', sans-serif" }}>
                                {selectedItem.title}
                            </h2>
                        </div>

                        <div className="chat-container">
                            {selectedItem.messages?.map((msg, idx) => (
                                <MessageBubble key={idx} message={msg} />
                            ))}
                            <div style={{ padding: '5rem 2rem', display: 'flex', justifyContent: 'center' }}>
                                <button
                                    className="btn-primary"
                                    style={{
                                        padding: '1.25rem 3rem',
                                        fontSize: '1.1rem',
                                        borderRadius: '16px',
                                        boxShadow: 'var(--shadow-premium)',
                                        fontFamily: "'Space Grotesk', sans-serif"
                                    }}
                                    onClick={handleContinueChat}
                                >
                                    Resume Synchronization <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="fade-in" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            background: 'var(--primary-glow)',
                            padding: '3rem',
                            borderRadius: '48px',
                            marginBottom: '3rem',
                            color: 'var(--primary)',
                            boxShadow: 'var(--shadow-premium)',
                            position: 'relative',
                            overflow: 'hidden' // Clipped shimmer
                        }}>
                            <MessageSquare size={80} strokeWidth={1} />
                            <div className="shimmer" />
                        </div>
                        <h2 style={{
                            color: 'var(--text-primary)',
                            marginBottom: '1.25rem',
                            fontWeight: 800,
                            fontSize: '2.5rem',
                            letterSpacing: '-0.05em',
                            fontFamily: "'Space Grotesk', sans-serif"
                        }}>Intelligence Logs</h2>
                        <p style={{
                            maxWidth: '500px',
                            fontSize: '1.2rem',
                            lineHeight: 1.7,
                            color: 'var(--text-muted)',
                            fontWeight: 500
                        }}>Select a recorded synchronization from the sidebar to review historic mining law interpretations and analysis reports.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default History;
