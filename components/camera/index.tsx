"use client";

import { useCallback, useEffect, useState } from "react";
import { CameraFeed } from "./camera-feed";
import { CameraOverlay } from "./camera-overlay";
import { ProductDetector } from "@/lib/product-detection";
import { Product } from "@/types/product";
import { Camera as CameraIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraProps {
  isActive: boolean;
  onProductDetected: (product: Product) => void;
}

export function Camera({ isActive, onProductDetected }: CameraProps) {
  const [detector] = useState(() => new ProductDetector());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isActive && !isInitialized) {
      detector.initialize().then(() => setIsInitialized(true));
    }
  }, [isActive, isInitialized, detector]);

  const handleFrame = useCallback(async (video: HTMLVideoElement) => {
    const product = await detector.detectProducts(video);
    if (product) {
      onProductDetected(product);
    }
  }, [detector, onProductDetected]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <div className="aspect-video relative">
        {isActive ? (
          <>
            <CameraFeed
              isActive={isActive}
              onFrame={handleFrame}
            />
            <CameraOverlay isScanning={isInitialized} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraIcon className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
            isActive ? "opacity-0" : "opacity-100"
          )}
        >
          {isActive && !isInitialized && (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          )}
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <h3 className="text-lg font-semibold">Product Detection</h3>
        <p className="text-sm text-gray-400">
          {isActive
            ? isInitialized
              ? "Camera is active and scanning for products..."
              : "Initializing product detection..."
            : "Start the camera to begin product detection"}
        </p>
      </div>
    </div>
  );
}