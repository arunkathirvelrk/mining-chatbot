import React, { useState } from 'react';
import { Plus, MessageSquare, Clock, Terminal, Pin, ChevronRight, BarChart3, X } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const Sidebar = ({ groupedItems = {}, selectedChatId, onItemSelect, loading, onNewChat, isMobileOpen, onClose }) => {
    const { pinnedMessages } = useChat();

    return (
        <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header" style={{ padding: '2rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                    className="btn-primary"
                    onClick={onNewChat}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '1rem',
                        boxShadow: 'var(--shadow-premium)',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                        border: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}
                >
                    <Plus size={20} strokeWidth={3} />
                    <span style={{ fontWeight: 700 }}>New Analysis</span>
                </button>

                {isMobileOpen && (
                    <button className="icon-btn mobile-only-flex" onClick={onClose} style={{ display: 'none' }}>
                        <X size={20} />
                    </button>
                )}
            </div>

            <div className="history-list">
                {/* Pinned Insights Section - High Visibility & Premium Look */}
                {pinnedMessages.length > 0 && (
                    <div className="history-group" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="history-group-title" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            paddingBottom: '0.75rem'
                        }}>
                            <Pin size={14} fill="currentColor" />
                            <span>Pinned Insights</span>
                        </h3>
                        {pinnedMessages.slice(0, 3).map((msg, idx) => (
                            <div
                                key={idx}
                                className="history-item pinned-insight-item"
                                style={{
                                    borderLeft: '3px solid var(--primary)',
                                    background: 'var(--primary-light)',
                                    margin: '4px 10px',
                                    borderRadius: '8px',
                                    padding: '0.6rem 0.8rem'
                                }}
                            >
                                <span style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--primary)',
                                    lineHeight: '1.4'
                                }}>
                                    {msg.text.substring(0, 35)}...
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <h3 className="history-group-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} />
                    <span>Recent Activity</span>
                </h3>

                {loading ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                        <div className="typing-indicator" style={{ background: 'transparent', justifyContent: 'center' }}>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                ) : Object.values(groupedItems).every(g => g.length === 0) ? (
                    <div style={{ padding: '3rem 1.5rem', textAlign: 'center', opacity: 0.5 }}>
                        <p style={{ fontSize: '0.85rem' }}>Your conversation history will appear here.</p>
                    </div>
                ) : (
                    Object.entries(groupedItems).map(([groupName, items]) => (
                        items.length > 0 && (
                            <div key={groupName} className="history-group" style={{ marginBottom: '0.75rem' }}>
                                <div style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    color: 'var(--text-muted)',
                                    paddingLeft: '1rem',
                                    paddingBottom: '0.4rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>{groupName}</div>
                                {items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`history-item ${selectedChatId === item.chat_id ? 'active' : ''}`}
                                        onClick={() => onItemSelect(item)}
                                        style={{ margin: '1px 8px' }}
                                    >
                                        <MessageSquare
                                            size={16}
                                            strokeWidth={selectedChatId === item.chat_id ? 2.5 : 2}
                                            style={{
                                                flexShrink: 0,
                                                opacity: selectedChatId === item.chat_id ? 1 : 0.6
                                            }}
                                        />
                                        <span style={{
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            fontSize: '0.875rem'
                                        }}>
                                            {item.title || "Untitled Chat"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )
                    ))
                )}
            </div>

            <div className="sidebar-footer" style={{
                padding: '1.5rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--primary-glow)',
                    borderRadius: '999px',
                    border: '1px solid var(--primary-light)'
                }}>
                    <img src="/logo.png" alt="MineLex" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    <span className="sidebar-footer-text" style={{
                        letterSpacing: '0.15em',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>MINELEX AI</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
