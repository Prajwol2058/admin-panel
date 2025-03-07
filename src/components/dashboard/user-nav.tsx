"use client";

import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserNav() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">{"Admin User"}</span>
      </div>
      <Button variant="ghost" size="icon">
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Log out</span>
      </Button>
    </div>
  );
}
