"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "@/components/dashboard/nav-links";
import { UserNav } from "@/components/dashboard/user-nav";

interface MobileNavProps {
  userRole?: string;
}

export function MobileNav({ userRole = "USER" }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-2 py-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              {userRole === "ADMIN" ? "Admin Dashboard" : "Content Dashboard"}
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <NavLinks userRole={userRole} />
          </div>
          <div className="border-t p-4">
            <UserNav />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
