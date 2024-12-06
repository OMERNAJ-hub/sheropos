"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, DollarSign, Package } from "lucide-react";

const data = [
  { name: "السبت", sales: 4000 },
  { name: "الأحد", sales: 3000 },
  { name: "الإثنين", sales: 2000 },
  { name: "الثلاثاء", sales: 2780 },
  { name: "الأربعاء", sales: 1890 },
  { name: "الخميس", sales: 2390 },
  { name: "الجمعة", sales: 3490 },
];

export default function StatisticsPage() {
  const [period, setPeriod] = useState("week");

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">إجمالي المبيعات</p>
                <h3 className="text-2xl font-bold">$12,426</h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">عدد المنتجات</p>
                <h3 className="text-2xl font-bold">1,245</h3>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Package className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">معدل النمو</p>
                <h3 className="text-2xl font-bold">+12.5%</h3>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">المعاملات</p>
                <h3 className="text-2xl font-bold">845</h3>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            >
              <option value="week">أسبوعي</option>
              <option value="month">شهري</option>
              <option value="year">سنوي</option>
            </select>
            <h2 className="text-xl font-semibold">تحليل المبيعات</h2>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
