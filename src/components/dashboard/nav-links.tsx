"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, FolderTree } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
  { name: "Content", href: "/dashboard/content", icon: FileText },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
