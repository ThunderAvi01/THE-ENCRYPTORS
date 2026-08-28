"use client";

import React, { useState } from "react";
import { UserRole } from "@/types/user";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface DashboardLayoutProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  role,
  userName = "User",
  userEmail = "user@example.com",
  activeTab,
  onTabChange,
  title,
  subtitle,
  children,
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        role={role}
        userName={userName}
        userEmail={userEmail}
        activeTab={activeTab}
        onTabChange={onTabChange}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav
          title={title}
          subtitle={subtitle}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
