"use client";

import React, { useState } from "react";
import { UserRole } from "@/types/user";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { Footer } from "@/components/layout/Footer";

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
    <div className="min-h-screen bg-background text-foreground">
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
      <div className="flex flex-col min-h-screen min-w-0 lg:pl-64">
        <TopNav
          title={title}
          subtitle={subtitle}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex-1">
            {children}
          </div>
          <div className="mt-8">
            <Footer forceShow={true} />
          </div>
        </main>
      </div>
    </div>
  );
}
