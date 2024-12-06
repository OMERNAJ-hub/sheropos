import Link from 'next/link';
import { Button } from '@/components/ui/button';
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">404 - الصفحة غير موجودة</h2>
        <p className="text-slate-400">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
      </div>
      <Button asChild>
        <Link href="/">
          العودة للرئيسية
        </Link>
      </Button>
    </div>
  );
}
