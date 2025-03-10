"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, FolderTree, Search } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
    roles: ["ADMIN"],
  },
  {
    name: "Content Management",
    href: "/dashboard/content",
    icon: FileText,
    roles: ["ADMIN"],
  },
  {
    name: "Browse Content",
    href: "/dashboard/search-content",
    icon: Search,
    roles: ["ADMIN", "USER"],
  },
];

interface NavLinksProps {
  userRole?: string;
}

export function NavLinks({ userRole = "USER" }: NavLinksProps) {
  const pathname = usePathname();

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="space-y-1">
      {filteredNavigation.map((item) => {
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
