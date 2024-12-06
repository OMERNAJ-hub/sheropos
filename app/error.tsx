'use client';
 
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">حدث خطأ ما</h2>
        <p className="text-slate-400">عذراً، حدث خطأ غير متوقع</p>
      </div>
      <Button
        variant="default"
        onClick={() => reset()}
      >
        حاول مرة أخرى
      </Button>
    </div>
  );
}
