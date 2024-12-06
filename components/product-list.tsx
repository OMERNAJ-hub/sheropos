"use client";

import { Product } from "@/types/product";
import { ShoppingBasket } from "lucide-react";

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const total = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBasket className="w-5 h-5" />
            Detected Products
          </h2>
          <span className="text-sm text-gray-400">
            {products.length} items | Total: ${total.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-700">
        {products.map((product, index) => (
          <div key={index} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-400">{product.barcode}</p>
              </div>
            </div>
            <span className="text-lg font-semibold">${product.price}</span>
          </div>
        ))}
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No products detected yet
          </div>
        )}
      </div>
    </div>
  );
}