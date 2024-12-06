"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const demoProducts: Product[] = [
  { id: "1", name: "تفاح أحمر", price: 5.99, quantity: 1 },
  { id: "2", name: "موز", price: 3.99, quantity: 2 },
  { id: "3", name: "برتقال", price: 4.99, quantity: 1 },
];

export function DetectedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // محاكاة اكتشاف المنتجات
    const timer = setTimeout(() => {
      setProducts(demoProducts);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const updateQuantity = (id: string, change: number) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = Math.max(0, product.quantity + change);
        return { ...product, quantity: newQuantity };
      }
      return product;
    }).filter(product => product.quantity > 0));
  };

  const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-500" />
          المنتجات المكتشفة
        </h2>
        <div className="text-sm text-gray-400">
          {products.length} منتج | الإجمالي: {total.toFixed(2)} ريال
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          لم يتم اكتشاف أي منتجات بعد
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-400">
                  السعر: {product.price.toFixed(2)} ريال
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="p-1 hover:bg-slate-600 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{product.quantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="p-1 hover:bg-slate-600 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right ml-4">
                <div className="font-medium">
                  {(product.price * product.quantity).toFixed(2)} ريال
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
