"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { 
  Menu, 
  LogOut,
  Settings as SettingsIcon,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function ModernHeader() {
  const router = useRouter();
  const { setSidebarOpen, user, setUser } = useStore();

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Menu Button - Desktop only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/genxet-logo.png" 
              alt="genxet" 
              className="w-7 h-7 object-contain"
            />
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              genxet
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl shadow-lg border border-gray-100">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => router.push("/settings")}
                  className="gap-2 cursor-pointer"
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="gap-2 text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:shadow-md transition-all"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}