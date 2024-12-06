"use client";

import { forwardRef } from "react";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface ReceiptContentProps {
  products: Product[];
}

export const ReceiptContent = forwardRef<HTMLDivElement, ReceiptContentProps>(
  ({ products }, ref) => {
    const subtotal = products.reduce((sum, product) => sum + product.price, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    return (
      <div ref={ref} className="p-8 bg-white text-black min-h-[600px]">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold">Smart POS AI</h1>
          <p className="text-sm text-gray-600">AI-Powered Checkout System</p>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Item</span>
            <span>Price</span>
          </div>
          {products.map((product, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{product.name}</span>
              <span>{formatCurrency(product.price)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (15%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Thank you for shopping with us!</p>
          <p>Please come again</p>
        </div>
      </div>
    );
  }
);