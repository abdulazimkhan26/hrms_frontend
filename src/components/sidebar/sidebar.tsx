"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { Menu, X, Settings, LogOut } from "lucide-react";

const items = [
  { name: "Admin Hub", path: "/admin" },
  { name: "Roles", path: "/admin/roles" },
  { name: "Positions", path: "/admin/positions" },
  { name: "Lookup Categories", path: "/admin/lookups/categories" },
  { name: "Lookup Values", path: "/admin/lookups/values" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { setToken } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    setToken("");
    router.push("/auth/login");
  };

  return (
    <>
      {/* Hamburger (always visible) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-gray-800 fixed top-4 left-4 z-50 bg-white rounded-md shadow-md"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Top */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">i4KHRMS</h1>

          <button onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 mt-6 px-2">
          {items.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 rounded-md transition
                ${
                  pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto p-4 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700" onClick={() => router.push("/admin/settings")}>
          <Settings size={18} />
          Settings
        </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}