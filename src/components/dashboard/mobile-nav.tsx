"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NavLinks } from "@/components/dashboard/nav-links";
import { UserNav } from "./user-nav";
import { Button, Sheet, SheetContent, SheetTrigger } from "../ui";

export function MobileNav() {
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
              Admin Dashboard
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <NavLinks />
          </div>
          <div className="border-t p-4">
            <UserNav />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
