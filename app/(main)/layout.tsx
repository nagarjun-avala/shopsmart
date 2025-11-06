"use client"

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import React, { useState } from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background">
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Sidebar
                isCollapsed={sidebarCollapsed}
                isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className={`pt-16 transition-all duration-300 ease-out ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                {children}
                {/* Mobile Overlay */}
                {isMenuOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </main>
        </div>
    )
}

export default MainLayout