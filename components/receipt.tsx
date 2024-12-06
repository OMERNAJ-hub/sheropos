"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { Receipt as ReceiptIcon, Printer } from "lucide-react";
import { Button } from "./ui/button";

interface ReceiptProps {
  show: boolean;
  onClose: () => void;
  products: Product[];
}

export function Receipt({ show, onClose, products }: ReceiptProps) {
  const total = products.reduce((sum, product) => sum + product.price, 0);
  const tax = total * 0.15;
  const grandTotal = total + tax;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5" />
            Receipt
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-lg">Smart POS AI</h3>
            <p className="text-sm text-gray-400">AI-Powered Checkout System</p>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="border-t border-b border-gray-700 py-4 space-y-2">
            {products.map((product, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{product.name}</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (15%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-700">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}