import React, { useState } from 'react';
import Navbar from './Navbar';

const Layout = ({ children, sidebarContent }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className="app-layout">
      
      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      {sidebarContent &&
        React.cloneElement(sidebarContent, {
          isMobileOpen,
          onClose: () => setIsMobileOpen(false),
        })}

      <main className="main-content">
        <Navbar onMenuClick={toggleSidebar} />

        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;