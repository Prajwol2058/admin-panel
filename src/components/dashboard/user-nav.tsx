"use client";

import { LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../ui";

export function UserNav() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">{user?.name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={logout}>
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Log out</span>
      </Button>
    </div>
  );
}
