"use client";

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CameraFeedProps {
  onFrame?: (video: HTMLVideoElement) => void;
  isActive: boolean;
  className?: string;
}

export function CameraFeed({ onFrame, isActive, className }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing camera:", err));

      const processFrame = () => {
        if (videoRef.current && onFrame) {
          onFrame(videoRef.current);
        }
        animationRef.current = requestAnimationFrame(processFrame);
      };

      animationRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isActive, onFrame]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={cn("w-full h-full object-cover", className)}
    />
  );
}