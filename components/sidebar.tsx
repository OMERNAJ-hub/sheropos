"use client";

import { Camera, LayoutGrid, Settings, Languages } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

const menuItems = [
  { href: "/", icon: Camera, label: "camera" },
  { href: "/products", icon: LayoutGrid, label: "products" },
  { href: "/settings", icon: Settings, label: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage } = useTranslation();

  const isActive = (path: string) => pathname === path;

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <div className="w-16 bg-slate-800/50 flex flex-col items-center py-4 border-r border-slate-700">
      <div className="flex-1 space-y-4">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <button
              className={`p-3 rounded-lg transition-colors ${
                isActive(href)
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-slate-700 hover:text-white"
              }`}
              title={label}
            >
              <Icon className="w-6 h-6" />
            </button>
          </Link>
        ))}
      </div>

      <button
        onClick={toggleLanguage}
        className="p-3 rounded-lg text-gray-400 hover:bg-slate-700 hover:text-white transition-colors mt-auto"
        title="Toggle Language"
      >
        <Languages className="w-6 h-6" />
        <span className="sr-only">
          {language === "ar" ? "English" : "العربية"}
        </span>
      </button>
    </div>
  );
}