import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { DetectedObject } from '@/lib/detection/productDetection';
import { Package } from 'lucide-react';

interface DetectedProductsProps {}

export interface DetectedProductsRef {
  updateProducts: (products: DetectedObject[]) => void;
}

export const DetectedProducts = forwardRef<DetectedProductsRef, DetectedProductsProps>((props, ref) => {
  const [products, setProducts] = useState<DetectedObject[]>([]);

  useImperativeHandle(ref, () => ({
    updateProducts: (newProducts: DetectedObject[]) => {
      setProducts(newProducts);
    }
  }));

  // حساب عدد المنتجات الفريدة
  const uniqueProductCount = new Set(products.map(p => p.name)).size;

  // حساب متوسط الثقة
  const averageConfidence = products.length > 0
    ? products.reduce((acc, curr) => acc + curr.confidence, 0) / products.length
    : 0;

  // تنسيق التاريخ
  const lastUpdate = products.length > 0 ? new Date().toLocaleTimeString('ar-SA') : '-';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="text-slate-400 text-sm mb-1">إجمالي المنتجات</h3>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="text-slate-400 text-sm mb-1">منتجات فريدة</h3>
          <p className="text-2xl font-bold">{uniqueProductCount}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="text-slate-400 text-sm mb-1">متوسط الثقة</h3>
          <p className="text-2xl font-bold">{(averageConfidence * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="text-slate-400 text-sm mb-1">آخر تحديث</h3>
          <p className="text-2xl font-bold">{lastUpdate}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="text-xl font-semibold mb-4">المنتجات المكتشفة</h3>
        {products.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>لم يتم اكتشاف أي منتج بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <span>{product.name}</span>
                <span className="text-blue-400">{(product.confidence * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
