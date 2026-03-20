import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { chatService } from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [historyItems, setHistoryItems] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const chatIdRef = useRef(null);
    const email = localStorage.getItem('email');

    const fetchHistory = useCallback(async () => {
        if (!email) return;
        setHistoryLoading(true);
        try {
            const data = await chatService.getHistory(email.toLowerCase());
            setHistoryItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
        }
    }, [email]);

    useEffect(() => {
        if (email) fetchHistory();
    }, [email, fetchHistory]);

    const newChat = () => {
        chatIdRef.current = null;
        setMessages([]);
    };

    const loadChat = (chatId, chatMessages) => {
        chatIdRef.current = chatId;
        setMessages(chatMessages || []);
    };

    const togglePin = (message) => {
        setPinnedMessages(prev => {
            const exists = prev.find(m => m.id === message.id || (m.text === message.text && m.timestamp === message.timestamp));
            if (exists) {
                return prev.filter(m => m !== exists);
            }
            return [...prev, message];
        });
    };

    return (
        <ChatContext.Provider value={{
            messages,
            setMessages,
            chatIdRef,
            newChat,
            loadChat,
            pinnedMessages,
            togglePin,
            historyItems,
            historyLoading,
            fetchHistory
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
