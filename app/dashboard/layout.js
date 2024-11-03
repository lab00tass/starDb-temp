"use client";

import { useState, useEffect } from 'react';
import DashboardSidebar from "../components/DashboardSidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (isSidebarOpen && !e.target.closest('#sidebar')) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <main className="w-full h-[100dvh-100px] md:h-screen flex overflow-hidden relative">
        <section className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <button onClick={toggleSidebar} className="w-auto h-auto md:hidden absolute top-4 right-4">
            {isSidebarOpen ? 'Close' : 'Open'}
          </button>
          <DashboardSidebar />
        </section>
        
        <aside className="w-full h-full overflow-auto px-5">{children}</aside>
      </main>
    </>
  );
}
