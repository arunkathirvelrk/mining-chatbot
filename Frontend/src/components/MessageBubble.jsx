import React, { useState } from 'react';
import { Bot, User, Copy, Pin, Printer } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const MessageBubble = ({ message }) => {
    const isBot = message.role === 'bot';
    const [copied, setCopied] = useState(false);
    const { togglePin, pinnedMessages } = useChat();

    // ✅ FIXED isPinned
    const isPinned = pinnedMessages.some(
        (m) =>
            m.id === message.id ||
            (m.text === message.text && m.timestamp === message.timestamp)
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <body style="font-family:sans-serif;padding:40px;">
                    <h2>MineLex Report</h2>
                    <pre>${message.text}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // ✅ CLEAN TEXT (REMOVE **)
    const renderContent = (text) => {
        if (!text) return null;

        return text.split('\n').map((line, idx) => {
            if (!line.trim()) {
                return <div key={idx} style={{ height: '0.5rem' }} />;
            }

            const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '$1');

            return (
                <div
                    key={idx}
                    style={{
                        marginBottom: '0.5rem',
                        color: isBot ? 'var(--text-main)' : 'inherit',
                        lineHeight: '1.6',
                    }}
                >
                    {cleanLine}
                </div>
            );
        });
    };

    return (
        <div className={`message-wrapper ${isBot ? 'bot' : 'user'} fade-in`}>

            {/* ✅ ACTION BUTTONS (OUTSIDE inner for full hover) */}
            <div className="message-header-actions">
                <button className="bubble-action-btn" onClick={handleCopy}>
                    <Copy size={14} />
                </button>

                {isBot && (
                    <>
                        <button
                            className="bubble-action-btn"
                            onClick={() => togglePin(message)}
                            style={{
                                color: isPinned ? 'var(--primary)' : undefined,
                            }}
                        >
                            <Pin size={14} />
                        </button>

                        <button className="bubble-action-btn" onClick={handlePrint}>
                            <Printer size={14} />
                        </button>
                    </>
                )}
            </div>

            <div className="message-content-inner">
                <div className="message-row">

                    {/* AVATAR */}
                    <div className="avatar">
                        {isBot ? <Bot size={18} /> : <User size={18} />}
                    </div>

                    {/* MESSAGE */}
                    <div className="message-content">
                        <div className="message-body">
                            {renderContent(message.text)}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MessageBubble;