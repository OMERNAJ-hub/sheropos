"use client";

import { useRef } from 'react';
import Camera from '@/components/camera/Camera';
import { DetectedProducts, type DetectedProductsRef } from '@/components/detection/DetectedProducts';
import Statistics from '@/components/stats/Statistics';
import type { DetectedObject } from '@/lib/detection/productDetection';

export default function Home() {
  const detectedProductsRef = useRef<DetectedProductsRef>(null);

  const handleDetection = (products: DetectedObject[]) => {
    if (detectedProductsRef.current) {
      detectedProductsRef.current.updateProducts(products);
    }
  };

  return (
    <div className="main-container">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* قسم الكاميرا */}
          <div className="space-y-6">
            <div className="camera-container p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>كشف المنتجات</span>
                <span className="text-sm text-blue-400 font-normal">
                  (يدعم {'>'}50 نوع من المنتجات)
                </span>
              </h2>
              <Camera onDetection={handleDetection} />
            </div>
            <Statistics />
          </div>

          {/* قسم المنتجات المكتشفة */}
          <div className="space-y-6">
            <div className="stat-card">
              <h2 className="text-lg font-semibold mb-4">المنتجات المكتشفة</h2>
              <DetectedProducts ref={detectedProductsRef} />
            </div>
          </div>
        </div>

        {/* إرشادات الاستخدام */}
        <div className="mt-8 stat-card">
          <h2 className="text-lg font-semibold mb-3">إرشادات الاستخدام</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>وجه الكاميرا نحو المنتج الذي تريد الكشف عنه</li>
            <li>حافظ على المنتج في مركز الكاميرا للحصول على أفضل نتائج</li>
            <li>تأكد من وجود إضاءة كافية حول المنتج</li>
            <li>يمكن الكشف عن عدة منتجات في نفس الوقت</li>
          </ul>
        </div>
      </div>
    </div>
  );
}