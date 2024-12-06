"use client";

import { motion } from "framer-motion";

interface CameraOverlayProps {
  isScanning: boolean;
}

export function CameraOverlay({ isScanning }: CameraOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 border-2 border-blue-500/50 rounded-lg" />
      {isScanning && (
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-blue-500"
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-blue-500 rounded-lg">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />
        </div>
      </div>
    </div>
  );
}