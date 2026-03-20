import React, { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import Layout from '../components/Layout';
import { groupHistoryByDate } from '../services/utils';
import { useChat } from '../context/ChatContext';

const Chat = () => {
    const { messages, setMessages, chatIdRef, newChat, loadChat } = useChat();
    const email = localStorage.getItem('email');

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const [historyItems, setHistoryItems] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    // ✅ THEME STATE
    const [theme, setTheme] = useState('light');

    /* ---------------- THEME SETUP ---------------- */

    // ✅ INITIAL LOAD (system or saved)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = prefersDark ? 'dark' : 'light';
            setTheme(initialTheme);
            document.documentElement.setAttribute('data-theme', initialTheme);
        }
    }, []);

    // ✅ APPLY THEME ON CHANGE
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // ✅ OPTIONAL: SYSTEM THEME LISTENER
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
        };

        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    // ✅ TOGGLE FUNCTION (you can pass this anywhere)
    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    /* ---------------- HISTORY ---------------- */

    const fetchHistory = useCallback(async () => {
        if (!email) return;
        try {
            const data = await chatService.getHistory(email.toLowerCase());
            setHistoryItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('History fetch failed:', err);
        } finally {
            setHistoryLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    /* ---------------- SEND MESSAGE ---------------- */

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const text = input;

        const nextMessages = [
            ...messages,
            { role: 'user', text }
        ];

        setMessages(nextMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await chatService.query({
                email,
                query: text,
                chat_id: chatIdRef.current,
                messages: nextMessages
            });

            if (!chatIdRef.current) {
                chatIdRef.current = res.chat_id;
            }

            setMessages(res.messages);
            fetchHistory();
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { role: 'bot', text: 'Something went wrong.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- CHAT ACTIONS ---------------- */

    const handleNewChat = () => {
        newChat();
        setInput('');
    };

    const handleHistoryClick = (chat) => {
        loadChat(chat.chat_id, chat.messages);
        setInput('');
    };

    const groupedItems = groupHistoryByDate(historyItems);

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Layout
                sidebarContent={
                    <Sidebar
                        groupedItems={groupedItems}
                        selectedChatId={chatIdRef.current}
                        onNewChat={handleNewChat}
                        onItemSelect={handleHistoryClick}
                        loading={historyLoading}
                        theme={theme}
                        toggleTheme={toggleTheme} // ✅ optional
                    />
                }
            >
                <ChatBox
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    onSend={handleSend}
                    loading={loading}
                    theme={theme}
                    toggleTheme={toggleTheme} // ✅ optional
                />
            </Layout>
        </div>
    );
};

export default Chat;