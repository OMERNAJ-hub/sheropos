"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { Receipt as ReceiptIcon, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { ReceiptContent } from "./receipt-content";

interface ReceiptProps {
  show: boolean;
  onClose: () => void;
  products: Product[];
}

export function Receipt({ show, onClose, products }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    pageStyle: `
      @page {
        size: 80mm 297mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5" />
            Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div className="hidden">
          <ReceiptContent ref={receiptRef} products={products} />
        </div>

        <div className="space-y-4">
          <ReceiptContent products={products} />
          <Button className="w-full" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}