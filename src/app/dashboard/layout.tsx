"use client";

import type React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav, NavLinks, UserNav } from "@/components/dashboard";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/components/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const role = user?.role;

  // Redirect users to the appropriate dashboard based on their role
  useEffect(() => {
    if (!isLoading && user) {
      // If user is not an admin and tries to access admin pages, redirect to user dashboard
      if (
        user.role !== "ADMIN" &&
        !window.location.pathname.includes("/dashboard/search-content")
      ) {
        router.push("/dashboard/search-content");
      }
    }
  }, [isLoading, user, router]);
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        {/* Mobile navigation */}
        <div className="sticky top-0 z-10 h-16 flex items-center gap-4 border-b bg-background px-4 md:hidden">
          <MobileNav userRole={user?.role} />
          <div className="flex-1">
            <Link
              href={
                role === "ADMIN" ? "/dashboard" : "/dashboard/search-content"
              }
              className="flex items-center gap-2 font-semibold"
            >
              {role === "ADMIN" ? "Admin Dashboard" : "Content Dashboard"}
            </Link>
          </div>
          <ThemeToggle />
        </div>

        {/* Desktop layout */}
        <div className="grid flex-1 md:grid-cols-[240px_1fr]">
          <div className="hidden border-r bg-muted/40 md:flex md:flex-col md:h-screen">
            <div className="h-16 flex items-center border-b px-4">
              <Link
                href={
                  role === "ADMIN" ? "/dashboard" : "/dashboard/search-content"
                }
                className="flex items-center gap-2 font-semibold"
              >
                {role === "ADMIN" ? "Admin Dashboard" : "Content Dashboard"}
              </Link>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <NavLinks userRole={user?.role} />
            </div>
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <UserNav />
                <ThemeToggle />
              </div>
            </div>
          </div>
          <div className="flex flex-col h-screen">
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
