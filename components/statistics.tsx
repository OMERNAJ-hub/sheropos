"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "@/hooks/useTranslation";
import { Activity, Package, ShoppingCart, TrendingUp } from "lucide-react";

const generateData = () => {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const time = new Date(now.getTime() - (11 - i) * 5000);
    return {
      time: time.toLocaleTimeString(),
      detections: Math.floor(Math.random() * 10) + 5,
      accuracy: (Math.random() * 20 + 80).toFixed(1),
      sales: Math.floor(Math.random() * 500) + 200,
    };
  });
};

export function Statistics() {
  const [data, setData] = useState(generateData());
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString(),
          detections: Math.floor(Math.random() * 10) + 5,
          accuracy: (Math.random() * 20 + 80).toFixed(1),
          sales: Math.floor(Math.random() * 500) + 200,
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "معدل الكشف",
      value: `${data[data.length - 1].detections} منتج/دقيقة`,
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "دقة التعرف",
      value: `${data[data.length - 1].accuracy}%`,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "المنتجات المكتشفة",
      value: `${data.reduce((acc, curr) => acc + curr.detections, 0)} منتج`,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "إجمالي المبيعات",
      value: `${data[data.length - 1].sales} ريال`,
      icon: ShoppingCart,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <h3 className="text-sm text-slate-400">{stat.title}</h3>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[300px] rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: "#64748b" }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="detections"
              name="الكشف"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="الدقة"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}