"use client";

import { useRef, useState, useEffect } from "react";
import { Camera as CameraIcon } from "lucide-react";

export function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${!isActive && 'hidden'}`}
      />
      
      {!isActive && (
        <button
          onClick={startCamera}
          className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
        >
          <CameraIcon className="w-12 h-12 text-blue-500" />
          <span className="text-lg font-medium">Start Camera</span>
        </button>
      )}

      {isActive && (
        <button
          onClick={stopCamera}
          className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
        >
          <CameraIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}