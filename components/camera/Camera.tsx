"use client";

import { useRef, useEffect, useState, forwardRef } from 'react';
import { Camera as CameraIcon, Loader2, Play, Square, AlertCircle, RefreshCw } from 'lucide-react';
import { initializeModel, detectProducts, drawDetections, type DetectedObject } from '@/lib/detection/productDetection';
import { DetectedProducts } from '../detection/DetectedProducts';

type CameraProps = {
  onDetection?: (products: DetectedObject[]) => void;
};

export default function Camera({ onDetection }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectedProductsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isModelReady, setIsModelReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const detectionIntervalRef = useRef<NodeJS.Timeout>();
  const streamRef = useRef<MediaStream | null>(null);
  
  // إضافة حالة للكاميرات المتاحة
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  // تحديث قائمة الكاميرات
  const refreshDevices = async () => {
    try {
      setError('');
      console.log('جاري تحديث قائمة الكاميرات...');
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('جميع الأجهزة:', devices);
      
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('كاميرات الفيديو:', videoDevices);
      
      if (videoDevices.length === 0) {
        throw new Error('لم يتم العثور على أي كاميرا');
      }

      setDevices(videoDevices);
      
      // اختيار أول كاميرا متاحة
      if (!selectedDevice && videoDevices.length > 0) {
        console.log('اختيار الكاميرا الافتراضية:', videoDevices[0].label);
        setSelectedDevice(videoDevices[0]);
      }
      
    } catch (err: any) {
      console.error('خطأ في تحديث الكاميرات:', err);
      setError(`فشل في العثور على الكاميرات: ${err.message}`);
      setIsLoading(false);
    }
  };

  // إعداد الكاميرا
  const setupCamera = async () => {
    if (!selectedDevice) {
      setError('الرجاء اختيار كاميرا');
      return;
    }

    try {
      setError('');
      console.log('بدء إعداد الكاميرا:', selectedDevice.label);

      // إيقاف أي تدفق فيديو نشط
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('تم إيقاف المسار:', track.label);
        });
      }

      // طلب الوصول للكاميرا
      const constraints = {
        video: {
          deviceId: { exact: selectedDevice.deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      console.log('طلب الوصول للكاميرا مع الإعدادات:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('تم الحصول على تدفق الكاميرا:', stream.id);
      
      if (!videoRef.current) {
        throw new Error('عنصر الفيديو غير موجود');
      }

      videoRef.current.srcObject = stream;
      
      // انتظار تحميل البيانات
      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadeddata = () => {
            console.log('تم تحميل بيانات الفيديو');
            resolve();
          };
        }
      });

      await videoRef.current.play();
      console.log('تم بدء تشغيل الفيديو');

      // تحديث أبعاد الكانفاس
      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        console.log(`تم تعيين أبعاد الكانفاس: ${canvasRef.current.width}x${canvasRef.current.height}`);
      }

    } catch (err: any) {
      console.error('خطأ في إعداد الكاميرا:', err);
      setError(`فشل في تشغيل الكاميرا: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    const setupDetection = async () => {
      try {
        setError('');
        setIsLoading(true);
        console.log('🚀 بدء تهيئة نظام الكشف...');
        
        // تحديث قائمة الكاميرات
        await refreshDevices();
        
        // تهيئة نموذج الكشف
        await initializeModel();
        setIsModelReady(true);
        console.log('✅ تم تهيئة النظام بنجاح');
        
      } catch (err: any) {
        console.error('❌ خطأ في تهيئة النظام:', err);
        setError(`فشل في تهيئة النظام: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    setupDetection();
  }, []);

  useEffect(() => {
    if (!isModelReady || !videoRef.current || !canvasRef.current || !isDetecting) {
      return;
    }

    const detectFrame = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        // الكشف عن المنتجات
        const products = await detectProducts(videoRef.current);
        
        // رسم النتائج
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          drawDetections(ctx, products);
        }

        // تحديث الواجهة
        if (onDetection) {
          onDetection(products);
        }

      } catch (err) {
        console.error('❌ خطأ في الكشف:', err);
        setError(`فشل في الكشف: ${err}`);
        setIsDetecting(false);
      }
    };

    // بدء حلقة الكشف
    const intervalId = setInterval(detectFrame, 100);
    return () => clearInterval(intervalId);

  }, [isModelReady, isDetecting, onDetection]);

  // بدء الكشف عن المنتجات
  const startDetection = async () => {
    try {
      setError('');
      if (!isModelReady) {
        throw new Error('نموذج الكشف غير جاهز');
      }

      setIsLoading(true);
      await setupCamera();
      
      if (!videoRef.current || !canvasRef.current) {
        throw new Error('عناصر الفيديو والكانفاس غير جاهزة');
      }

      setIsDetecting(true);
      setIsLoading(false);

    } catch (err: any) {
      console.error('خطأ في بدء الكشف:', err);
      setError(`فشل في بدء الكشف: ${err.message}`);
      setIsLoading(false);
      setIsDetecting(false);
    }
  };

  // إيقاف الكشف
  const stopDetection = () => {
    setIsDetecting(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-slate-800/50 rounded-xl border border-slate-700">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* اختيار الكاميرا */}
      <div className="flex items-center gap-2">
        <select
          id="camera-select"
          name="camera-select"
          value={selectedDevice?.deviceId || ''}
          onChange={(e) => {
            const device = devices.find(d => d.deviceId === e.target.value);
            console.log('تم اختيار الكاميرا:', device?.label);
            setSelectedDevice(device || null);
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
          disabled={isDetecting}
        >
          <option value="">اختر الكاميرا</option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `كاميرا ${devices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={refreshDevices}
          disabled={isDetecting}
          className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 hover:bg-slate-700/50"
          title="تحديث قائمة الكاميرات"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="relative bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-[400px] object-contain"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <p className="text-slate-200">جاري تحميل نموذج الكشف...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}

        {!isDetecting && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={startDetection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!selectedDevice || !isModelReady}
            >
              بدء الكشف
            </button>
          </div>
        )}

        {isDetecting && (
          <button
            type="button"
            onClick={stopDetection}
            className="absolute top-2 right-2 p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-700/90 transition-colors"
          >
            إيقاف الكشف
          </button>
        )}
      </div>

      {/* مكون المنتجات المكتشفة */}
      <DetectedProducts ref={detectedProductsRef} />
    </div>
  );
}
