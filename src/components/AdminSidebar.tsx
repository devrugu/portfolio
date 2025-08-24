"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

const adminNavLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Resume Editor", href: "/admin/resume" }, // For a future task
  { name: "Analytics", href: "/admin/analytics" },   // For a future task
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900/50 p-4 border-r border-gray-700/50">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary mb-8">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            {adminNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-accent text-on-primary"
                        : "text-on-background hover:bg-gray-800/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <SignOutButton />
      </div>
    </div>
  );
}