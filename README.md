# نظام التعرف على المنتجات باستخدام YOLOv8

نظام متقدم للتعرف على المنتجات في نقاط البيع باستخدام تقنيات الرؤية الحاسوبية المتقدمة.

## المميزات
- كشف فوري للمنتجات باستخدام YOLOv8
- دعم اللغة العربية
- واجهة مستخدم حديثة وسلسة
- أداء عالي في المتصفح
- دعم متعدد الكاميرات

## المتطلبات
1. تثبيت حزم Node.js:
```bash
npm install
# أو
yarn install
```

2. تحميل نموذج YOLO:
- قم بإنشاء مجلد `public/models`
- قم بتحميل ملف `yolov8n.onnx` من [Ultralytics](https://github.com/ultralytics/ultralytics)
- ضع الملف في مجلد `public/models`

3. تثبيت ONNX Runtime:
```bash
npm install onnxruntime-web
# أو
yarn add onnxruntime-web
```

## التشغيل
1. تشغيل خادم التطوير:
```bash
npm run dev
# أو
yarn dev
```

2. فتح المتصفح على العنوان:
```
http://localhost:3006
```

## ملاحظات هامة
- تأكد من تفعيل WebGL في المتصفح
- اسمح للمتصفح بالوصول إلى الكاميرا
- استخدم متصفح حديث يدعم WebGL و WebAssembly

## الترخيص
هذا المشروع مرخص تحت رخصة MIT.
