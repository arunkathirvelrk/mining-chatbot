import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Send, Bot, Shield, Book, Zap, Users, Search, X } from 'lucide-react';

const ChatBox = ({ messages, input, setInput, onSend, loading }) => {
    const messagesEndRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
            <div className="chat-header-actions" style={{
                position: 'sticky',
                top: 0,
                zIndex: 15,
                padding: '0.75rem 2rem',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '1rem'
            }}>
                {isSearchVisible ? (
                    <div className="search-bar-inline fade-in">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search within this chat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button onClick={() => { setSearchQuery(''); setIsSearchVisible(false); }}>
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button className="icon-btn-utility" onClick={() => setIsSearchVisible(true)} title="Search chat">
                        <Search size={18} />
                    </button>
                )}
            </div>

            <div className="chat-container">
                {messages.length === 0 && !loading && (
                    <div className="fade-in" style={{
                        maxWidth: '800px',
                        margin: 'auto',
                        padding: '12vh 2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '1.5rem',
                            background: 'var(--primary-glow)',
                            borderRadius: '30px',
                            color: 'var(--primary)',
                            marginBottom: '2.5rem',
                            boxShadow: 'var(--shadow-premium)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Bot size={64} strokeWidth={1.5} />
                            <div className="shimmer" />
                        </div>

                        <h1 style={{
                            fontSize: '3.5rem',
                            fontWeight: 800,
                            marginBottom: '1rem',
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.05em',
                            fontFamily: "'Space Grotesk', sans-serif"
                        }}>
                            Mine<span style={{ color: 'var(--primary)' }}>Lex</span>
                        </h1>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '1.25rem',
                            marginBottom: '4rem',
                            maxWidth: '600px',
                            margin: '0 auto 4rem auto',
                            lineHeight: 1.6,
                            fontWeight: 500
                        }}>
                            Expert intelligence for Indian coal mining regulations, safety standards, and legal compliance.
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            {[
                                { icon: <Shield size={18} />, text: "Safety Regulations", query: "What are the latest safety regulations for underground coal mines?" },
                                { icon: <Book size={18} />, text: "Mines Act 1952", query: "Explain the key provisions of the Mines Act 1952." },
                                { icon: <Zap size={18} />, text: "Compliance Check", query: "What are the environmental compliance requirements for new mines?" }
                            ].map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(s.query)}
                                    style={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '16px',
                                        padding: '1.25rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.75rem'
                                    }}
                                    className="suggestion-card"
                                >
                                    <div style={{ color: 'var(--primary)' }}>{s.icon}</div>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ paddingTop: '1rem' }}>
                    {messages.map((msg, idx) => (
                        <MessageBubble key={idx} message={msg} searchQuery={searchQuery} />
                    ))}
                </div>

                {loading && (
                    <div className="message-wrapper bot">
                        <div className="message-content-inner">
                            <div className="message-body" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
                                <div className="typing-indicator" style={{ background: 'transparent', padding: '1rem 0' }}>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} style={{ height: '40px' }} />
            </div>

            <div className="input-area">
                <form className="input-wrapper-pill" onSubmit={onSend}>
                    <input
                        type="text"
                        placeholder="Ask about coal mining laws, safety, compliance..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="pill-input-field"
                    />

                    <button
                        className="send-pill-btn"
                        type="submit"
                        disabled={!input.trim() || loading}
                    >
                        <Send size={18} strokeWidth={2.5} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
