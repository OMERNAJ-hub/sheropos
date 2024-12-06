"use client";

import { BarChart3, Package, Clock, Zap, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Statistics() {
  const [stats, setStats] = useState({
    totalDetections: 0,
    avgDetectionTime: 0,
    accuracy: 0,
    fps: 0,
  });

  // محاكاة تحديث الإحصائيات كل ثانية
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const updateFPS = () => {
      const currentTime = performance.now();
      const delta = currentTime - lastTime;
      if (delta >= 1000) {
        setStats(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / delta),
        }));
        frameCount = 0;
        lastTime = currentTime;
      }
      frameCount++;
      requestAnimationFrame(updateFPS);
    };

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalDetections: prev.totalDetections + Math.floor(Math.random() * 3),
        avgDetectionTime: 0.8 + Math.random() * 0.4,
        accuracy: 90 + Math.random() * 5,
      }));
    }, 2000);

    updateFPS();

    return () => {
      clearInterval(interval);
    };
  }, []);

  const statItems = [
    {
      id: 1,
      name: 'المنتجات المكتشفة',
      value: stats.totalDetections.toString(),
      icon: Package,
      trend: '+3',
      trendUp: true,
    },
    {
      id: 2,
      name: 'سرعة المعالجة',
      value: `${stats.fps} FPS`,
      icon: Cpu,
      trend: stats.fps > 15 ? 'ممتاز' : 'جيد',
      trendUp: stats.fps > 15,
    },
    {
      id: 3,
      name: 'وقت الكشف',
      value: `${stats.avgDetectionTime.toFixed(1)}ms`,
      icon: Clock,
      trend: stats.avgDetectionTime < 1 ? 'سريع' : 'عادي',
      trendUp: stats.avgDetectionTime < 1,
    },
    {
      id: 4,
      name: 'دقة الكشف',
      value: `${stats.accuracy.toFixed(1)}%`,
      icon: Zap,
      trend: stats.accuracy > 95 ? 'ممتاز' : 'جيد',
      trendUp: stats.accuracy > 95,
    },
  ];

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        الإحصائيات المباشرة
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-slate-300">{stat.name}</h3>
              </div>
              
              <div className="flex items-end justify-between">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <span 
                  className={`text-sm px-2 py-1 rounded-full ${
                    stat.trendUp 
                      ? 'text-green-400 bg-green-400/10' 
                      : 'text-yellow-400 bg-yellow-400/10'
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
