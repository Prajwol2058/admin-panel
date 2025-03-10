"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated()) {
      toast.error("Authentication required", {
        description: "Please log in to access this page",
      });
      router.push("/login");
      return;
    }

    // If authenticated but trying to access admin pages as a regular user
    if (!isLoading && user && user.role !== "ADMIN") {
      // List of admin-only paths
      const adminPaths = ["/dashboard/categories", "/dashboard/content"];

      // Check if current path is admin-only and not the content view page
      const isAdminPath =
        adminPaths.some((path) => pathname.startsWith(path)) &&
        !pathname.includes("/dashboard/search-content");

      if (isAdminPath) {
        toast.error("Access denied", {
          description: "You don't have permission to access this page",
        });
        router.push("/dashboard/content/view");
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
