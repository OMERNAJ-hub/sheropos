import torch
from ultralytics import YOLO
import os

# المسار الكامل للملف المصدر والهدف
input_path = "D:/projects D/sys4/frontend/scripts/yolov8n.pt"
output_dir = "D:/projects D/sys4/frontend/public/models"

# إنشاء المجلد إذا لم يكن موجوداً
os.makedirs(output_dir, exist_ok=True)

# تحميل النموذج المحلي
model = YOLO(input_path)

# تصدير النموذج بصيغة ONNX مع تعيين إصدار opset أقدم
model.export(format="onnx", imgsz=640, opset=12, simplify=True)
