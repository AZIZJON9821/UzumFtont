'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/contexts/CartContext';
import { showToast } from '../ui/Toast';
import type { CartItem as CartItemType } from '@/lib/types';
import { Trash2, Minus, Plus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [updating, setUpdating] = useState(false);

  const { variant } = item;
  const price = variant.discountPrice || variant.price;
  const productName = variant.product?.name || "Noma'lum mahsulot";
  const mainImage =
    variant.images.find((img) => img.isMain) || variant.images[0];

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > variant.stock) return;

    try {
      setUpdating(true);
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      showToast('Xatolik yuz berdi', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(item.id);
      showToast("Savatdan o'chirildi", 'success');
    } catch (error) {
      showToast('Xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 flex gap-4 relative">
      {/* Image */}
      <Link href={`/product/${variant.productId}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 bg-slate-100 rounded-lg overflow-hidden">
          {mainImage?.url ? (
            <Image
              src={mainImage.url}
              alt={productName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${variant.productId}`}
          className="font-medium text-slate-900 hover:text-[#7000ff] line-clamp-2 mb-2 block"
        >
          {productName}
        </Link>

        <div className="flex flex-wrap gap-2 text-sm text-slate-600 mb-3">
          {variant.color && (
            <span className="flex items-center gap-1">
              <span
                className="w-4 h-4 rounded-full border border-slate-300"
                style={{ backgroundColor: variant.color.hexCode }}
              />
              {variant.color.name}
            </span>
          )}
          {variant.size && <span>O'lcham: {variant.size.name}</span>}
        </div>

        {/* Price & Quantity */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {price.toLocaleString('uz-UZ')} so'm
            </p>
            {variant.discountPrice && (
              <p className="text-sm text-slate-400 line-through">
                {variant.price.toLocaleString('uz-UZ')} so'm
              </p>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="w-10 text-center font-semibold">
              {item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={updating || item.quantity >= variant.stock}
              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stock warning */}
        {item.quantity >= variant.stock && (
          <p className="text-xs text-orange-600 mt-2">
            Omborda {variant.stock} ta qoldi
          </p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
