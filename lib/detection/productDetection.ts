import * as tf from '@tensorflow/tfjs';
import { initializeYOLO, detectWithYOLO } from './yoloDetection';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedObject {
  id: string;
  name: string;
  confidence: number;
  bbox: BoundingBox;
  timestamp: number;
}

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export async function initializeModel(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      if (!isInitialized) {
        console.log('🚀 بدء تهيئة نظام الكشف...');

        // تهيئة TensorFlow.js
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('✅ تم تهيئة TensorFlow.js');
        console.log('🔧 الخلفية المستخدمة:', tf.getBackend());

        // تهيئة نموذج YOLO
        await initializeYOLO();
        
        isInitialized = true;
        console.log('✅ تم تهيئة نظام الكشف بنجاح');
      }
    } catch (error) {
      console.error('❌ خطأ في تهيئة نظام الكشف:', error);
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

export async function detectProducts(videoElement: HTMLVideoElement): Promise<DetectedObject[]> {
  if (!isInitialized) {
    console.log('⚡ نظام الكشف غير مهيأ، جاري التهيئة...');
    await initializeModel();
  }

  try {
    // التأكد من أن الفيديو جاهز
    if (!videoElement.videoWidth || !videoElement.videoHeight) {
      console.warn('⚠️ الفيديو غير جاهز بعد');
      return [];
    }

    console.time('detection');
    const detections = await detectWithYOLO(videoElement);
    console.timeEnd('detection');

    return detections;
  } catch (error) {
    console.error('❌ خطأ في الكشف عن المنتجات:', error);
    return [];
  }
}

export function drawDetections(
  ctx: CanvasRenderingContext2D,
  detections: DetectedObject[]
): void {
  // مسح الكانفاس
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  detections.forEach(detection => {
    const { bbox, name, confidence } = detection;
    const { x, y, width, height } = bbox;

    // رسم المربع
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // رسم التسمية
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Cairo';
    const label = `${name} ${(confidence * 100).toFixed(1)}%`;
    const textWidth = ctx.measureText(label).width;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y - 25, textWidth + 10, 25);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, x + 5, y - 7);
  });
}
