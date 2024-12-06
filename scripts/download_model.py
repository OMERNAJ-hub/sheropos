from ultralytics import YOLO
import os

# إنشاء المجلد إذا لم يكن موجوداً
os.makedirs("public/models", exist_ok=True)

# تحميل النموذج
model = YOLO("yolov8n.pt")

# تصدير النموذج بصيغة ONNX
model.export(format="onnx", imgsz=640)

# نقل الملف إلى المجلد الصحيح
import shutil
shutil.move("yolov8n.onnx", "public/models/yolov8n.onnx")
