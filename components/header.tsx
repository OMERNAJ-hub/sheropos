"use client";

import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-slate-800/30 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center gap-4 group">
        <div className="logo-icon relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
          <Camera className="w-8 h-8 text-blue-500 relative z-10" />
        </div>
        <div className="relative">
          <h1 className="logo-text text-3xl font-bold tracking-wider">
            $_𝓢𝓱𝓮𝓻𝓸𝓩𝓪𝓔𝓭 𝓒𝓬𝓱 𝓐𝓘
          </h1>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        </div>
      </div>
      <nav className="flex items-center gap-4">
        <Button variant="default" size="lg">
          بدء الكشف
        </Button>
      </nav>
    </header>
  );
}