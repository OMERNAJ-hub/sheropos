import * as ort from 'onnxruntime-web';
import { DetectedObject } from './productDetection';

// تكوين ONNX Runtime
const options: ort.InferenceSession.SessionOptions = {
  executionProviders: ['webgl', 'wasm'],
  graphOptimizationLevel: 'all'
};

// تعيين مسار WASM
ort.env.wasm.wasmPaths = '/onnx/';

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

export async function initializeYOLO(): Promise<void> {
  if (isInitializing || session) return;

  try {
    isInitializing = true;
    console.log('🚀 بدء تهيئة نموذج YOLO...');
    console.log('📂 مسار النموذج:', MODEL_PATH);

    // تحميل النموذج
    session = await ort.InferenceSession.create(MODEL_PATH, options);
    console.log('✅ تم تحميل النموذج بنجاح!');
    console.log('ℹ️ معلومات النموذج:', {
      inputs: session.inputNames,
      outputs: session.outputNames
    });

  } catch (error) {
    console.error('❌ خطأ في تهيئة النموذج:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

export async function detectWithYOLO(videoElement: HTMLVideoElement): Promise<DetectedObject[]> {
  if (!session) {
    console.error('❌ لم يتم تهيئة النموذج');
    throw new Error('لم يتم تهيئة النموذج');
  }

  try {
    console.log('🔍 بدء الكشف عن المنتجات...');

    // إنشاء canvas مؤقت
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('فشل في إنشاء سياق Canvas');
    }

    // رسم الإطار الحالي على canvas
    ctx.drawImage(videoElement, 0, 0);

    // الحصول على بيانات الصورة
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // معالجة الصورة
    const inputArray = new Float32Array(imageData.width * imageData.height * 3);
    let inputIndex = 0;

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        const pixelIndex = (y * imageData.width + x) * 4;
        inputArray[inputIndex++] = imageData.data[pixelIndex] / 255.0;     // R
        inputArray[inputIndex++] = imageData.data[pixelIndex + 1] / 255.0; // G
        inputArray[inputIndex++] = imageData.data[pixelIndex + 2] / 255.0; // B
      }
    }

    // تشغيل النموذج
    console.log('🤖 تشغيل النموذج...');
    const tensor = new ort.Tensor('float32', inputArray, [1, 3, imageData.height, imageData.width]);
    const outputs = await session.run({ images: tensor });
    const predictions = outputs[session.outputNames[0]].data as Float32Array;

    // معالجة النتائج
    const detections: DetectedObject[] = [];
    const numPredictions = predictions.length / 7;

    console.log('📊 عدد التوقعات:', numPredictions);

    for (let i = 0; i < numPredictions; i++) {
      const offset = i * 7;
      const confidence = predictions[offset + 4];
      const classId = Math.floor(predictions[offset + 5]);
      const className = PRODUCT_CLASSES[classId];

      if (confidence > 0.5 && className) {
        const x = predictions[offset] * canvas.width;
        const y = predictions[offset + 1] * canvas.height;
        const width = (predictions[offset + 2] - predictions[offset]) * canvas.width;
        const height = (predictions[offset + 3] - predictions[offset + 1]) * canvas.height;

        detections.push({
          id: `${i}-${Date.now()}`,
          name: ARABIC_NAMES[className] || className,
          confidence,
          bbox: { x, y, width, height },
          timestamp: Date.now()
        });
      }
    }

    console.log('✨ تم اكتشاف المنتجات:', detections);
    return detections;

  } catch (error) {
    console.error('❌ خطأ في الكشف:', error);
    throw error;
  }
}
