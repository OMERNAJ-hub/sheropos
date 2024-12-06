import * as ort from 'onnxruntime-web';
import { DetectedObject } from './productDetection';

// تكوين ONNX Runtime مع تحسينات الأداء
const options: ort.InferenceSession.SessionOptions = {
  executionProviders: ['webgl'],
  graphOptimizationLevel: 'all',
  enableCpuMemArena: true,
  enableMemPattern: true,
  executionMode: 'sequential',
  logSeverityLevel: 0
};

// تعيين مسار WASM
ort.env.wasm.wasmPaths = '/onnx/';
ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4;

// تعيين مسار النموذج
const MODEL_PATH = '/models/yolov8n.onnx';

// فئات المنتجات المدعومة مع ترجمتها
const PRODUCT_CLASSES = [
  'bottle', 'cup', 'bowl', 'wine glass', 'fork', 'knife', 'spoon',
  'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot',
  'hot dog', 'pizza', 'donut', 'cake'
];

// ترجمة الفئات إلى العربية
const ARABIC_NAMES: { [key: string]: string } = {
  'bottle': 'زجاجة',
  'cup': 'كوب',
  'bowl': 'وعاء',
  'wine glass': 'كأس',
  'fork': 'شوكة',
  'knife': 'سكين',
  'spoon': 'ملعقة',
  'banana': 'موز',
  'apple': 'تفاحة',
  'sandwich': 'شطيرة',
  'orange': 'برتقال',
  'broccoli': 'بروكلي',
  'carrot': 'جزر',
  'hot dog': 'هوت دوج',
  'pizza': 'بيتزا',
  'donut': 'دونات',
  'cake': 'كيك'
};

let session: ort.InferenceSession | null = null;
let isInitializing = false;
let lastProcessingTime = 0;
const PROCESSING_INTERVAL = 100; // معالجة كل 100 مللي ثانية

export async function initializeYOLO(): Promise<void> {
  if (isInitializing || session) return;

  try {
    isInitializing = true;
    console.log('🔄 جاري تهيئة نموذج YOLO...');

    // تحميل النموذج
    session = await ort.InferenceSession.create(MODEL_PATH, options);
    console.log('✅ تم تحميل نموذج YOLO بنجاح');

  } catch (error) {
    console.error('❌ خطأ في تهيئة نموذج YOLO:', error);
    session = null;
    throw error;
  } finally {
    isInitializing = false;
  }
}

export async function detectWithYOLO(videoElement: HTMLVideoElement): Promise<DetectedObject[]> {
  if (!session) {
    throw new Error('لم يتم تهيئة نموذج YOLO بعد');
  }

  const now = Date.now();
  if (now - lastProcessingTime < PROCESSING_INTERVAL) {
    return [];
  }
  lastProcessingTime = now;

  try {
    // تحويل الفيديو إلى تنسور
    const tensor = await preprocessImage(videoElement);
    
    // تشغيل النموذج
    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = tensor;
    
    const results = await session.run(feeds);
    const output = results[session.outputNames[0]];

    // معالجة النتائج
    return processDetections(output, videoElement.width, videoElement.height);
  } catch (error) {
    console.error('❌ خطأ في الكشف:', error);
    return [];
  }
}

async function preprocessImage(videoElement: HTMLVideoElement): Promise<ort.Tensor> {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;
  
  // رسم الفيديو على Canvas مع الحفاظ على النسبة
  const scale = Math.min(640 / videoElement.videoWidth, 640 / videoElement.videoHeight);
  const width = videoElement.videoWidth * scale;
  const height = videoElement.videoHeight * scale;
  const x = (640 - width) / 2;
  const y = (640 - height) / 2;
  
  ctx.drawImage(videoElement, x, y, width, height);
  
  // تحويل البيانات إلى Float32Array
  const imageData = ctx.getImageData(0, 0, 640, 640);
  const data = new Float32Array(3 * 640 * 640);
  
  for (let i = 0; i < imageData.data.length / 4; i++) {
    data[i] = imageData.data[i * 4] / 255.0;
    data[i + 640 * 640] = imageData.data[i * 4 + 1] / 255.0;
    data[i + 2 * 640 * 640] = imageData.data[i * 4 + 2] / 255.0;
  }
  
  return new ort.Tensor('float32', data, [1, 3, 640, 640]);
}

function processDetections(output: ort.Tensor, width: number, height: number): DetectedObject[] {
  const data = output.data as Float32Array;
  const results: DetectedObject[] = [];
  const numDetections = data.length / 84; // 84 = 4 (bbox) + 80 (classes)
  
  for (let i = 0; i < numDetections; i++) {
    const scores = data.slice(i * 84 + 4, (i + 1) * 84);
    const classId = scores.indexOf(Math.max(...scores));
    const confidence = scores[classId];
    
    if (confidence > 0.5 && PRODUCT_CLASSES.includes(PRODUCT_CLASSES[classId])) {
      const bbox = {
        x: data[i * 84] * width,
        y: data[i * 84 + 1] * height,
        width: (data[i * 84 + 2] - data[i * 84]) * width,
        height: (data[i * 84 + 3] - data[i * 84 + 1]) * height
      };
      
      results.push({
        id: `${Date.now()}-${i}`,
        name: ARABIC_NAMES[PRODUCT_CLASSES[classId]] || PRODUCT_CLASSES[classId],
        confidence,
        bbox,
        timestamp: Date.now()
      });
    }
  }
  
  return results;
}
