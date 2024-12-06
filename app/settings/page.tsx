"use client";

import { useState } from "react";
import { Moon, Sun, Globe } from "lucide-react";

export default function SettingsPage() {
  const [language, setLanguage] = useState("ar");
  const [theme, setTheme] = useState("dark");

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-right">الإعدادات العامة</h2>
          
          {/* Language Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
              <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-5 h-5" />
                <span>اللغة</span>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-lg ${
                    theme === "light" ? "bg-blue-500" : "bg-gray-700"
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-lg ${
                    theme === "dark" ? "bg-blue-500" : "bg-gray-700"
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
              <span className="text-gray-400">المظهر</span>
            </div>
          </div>
        </div>

        {/* Camera Settings */}
        <div className="rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-right">إعدادات الكاميرا</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <select
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option>كاميرا افتراضية</option>
                <option>كاميرا خارجية</option>
              </select>
              <span className="text-gray-400">اختيار الكاميرا</span>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="range"
                min="0"
                max="100"
                className="w-48"
              />
              <span className="text-gray-400">دقة الكشف</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
