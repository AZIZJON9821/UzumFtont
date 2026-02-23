'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCart } from '@/lib/contexts/CartContext';
import { PaymentMethod } from '@/components/checkout/PaymentMethod';
import { ordersApi } from '@/lib/api/orders';
import { pickupPointsApi, PickupPoint } from '@/lib/api/pickup-points';
import { showToast } from '@/components/ui/Toast';
import { LoadingPage } from '@/components/ui/Loading';
import { ShoppingBag, MapPin, CreditCard, CheckCircle, Truck, Search, ChevronDown } from 'lucide-react';
import type { PaymentMethod as PaymentMethodType } from '@/lib/types';

// Dynamically import Map
const Map = dynamic(() => import('@/components/ui/Map'), {
  ssr: false,
  loading: () => <div className="h-40 bg-slate-100 animate-pulse flex items-center justify-center rounded-lg">Xarita yuklanmoqda...</div>
});

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, itemCount, clearCart } = useCart();

  const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('CASH');
  const [submitting, setSubmitting] = useState(false);

  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PickupPoint | null>(null);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [isPointsOpen, setIsPointsOpen] = useState(false);
  const [pointSearchQuery, setPointSearchQuery] = useState('');

  useEffect(() => {
    if (deliveryType === 'PICKUP') {
      loadPickupPoints();
    }
  }, [deliveryType]);

  const loadPickupPoints = async () => {
    try {
      setLoadingPoints(true);
      const data = await pickupPointsApi.getAll({ isActive: true });
      setPickupPoints(data);
      if (data.length > 0 && !selectedPickupPoint) {
        setSelectedPickupPoint(data[0]);
      }
    } catch (error) {
      showToast('Olib ketish nuqtalarini yuklashda xatolik', 'error');
    } finally {
      setLoadingPoints(false);
    }
  };

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="h-20 w-20 text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Savat bo'sh
            </h2>
            <p className="text-slate-500 mb-6">
              Buyurtma berish uchun mahsulot qo'shing
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const deliveryFee = deliveryType === 'DELIVERY' ? (totalAmount >= 50000 ? 0 : 15000) : 0;
  const finalTotal = totalAmount + deliveryFee;

  const handleSubmit = async () => {
    try {
      if (deliveryType === 'PICKUP' && !selectedPickupPoint) {
        showToast('Iltimos, olib ketish nuqtasini tanlang', 'error');
        return;
      }

      setSubmitting(true);

      await ordersApi.create({
        addressId: deliveryType === 'DELIVERY' ? 'static-default-address-id' : undefined,
        pickupPointId: deliveryType === 'PICKUP' ? selectedPickupPoint?.id : undefined,
        deliveryType: deliveryType,
        paymentMethod: selectedPaymentMethod,
      } as any);

      showToast('Buyurtma qabul qilindi!', 'success');
      await clearCart();
      router.push('/profile?tab=orders');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Buyurtmani rasmiylashtirish
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type Toggle */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Yetkazib berish turi</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryType('DELIVERY')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${deliveryType === 'DELIVERY'
                    ? 'border-[#7000ff] bg-[#7000ff]/5 text-[#7000ff]'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                >
                  <Truck className="h-6 w-6" />
                  <span className="font-bold">Kuryer orqali</span>
                </button>
                <button
                  onClick={() => setDeliveryType('PICKUP')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${deliveryType === 'PICKUP'
                    ? 'border-[#7000ff] bg-[#7000ff]/5 text-[#7000ff]'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                >
                  <MapPin className="h-6 w-6" />
                  <span className="font-bold">Olib ketish nuqtasi</span>
                </button>
              </div>
            </div>

            {/* Address or Pickup Point Selection */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#7000ff]/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#7000ff]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {deliveryType === 'DELIVERY' ? 'Yetkazib berish manzili' : 'Olib ketish nuqtasini tanlang'}
                </h2>
              </div>

              {deliveryType === 'DELIVERY' ? (
                <div className="border-2 border-[#7000ff]/5 bg-[#7000ff]/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#7000ff]/10 rounded-lg mt-1">
                      <MapPin className="h-5 w-5 text-[#7000ff]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Tashkent, Yunusobod tumani</h4>
                      <p className="text-sm text-slate-600 mb-2">Amir Temur ko'chasi, 123-uy</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {loadingPoints ? (
                    <div className="h-40 bg-slate-50 animate-pulse rounded-lg" />
                  ) : (
                    <>
                      {/* Custom Dropdown Selection */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Topshirish punkti
                        </label>
                        <div className="relative mt-1">
                          <div
                            className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 flex items-center justify-between cursor-pointer hover:border-[#7000ff] transition-colors"
                            onClick={() => setIsPointsOpen(!isPointsOpen)}
                          >
                            <span className={selectedPickupPoint ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                              {selectedPickupPoint ? selectedPickupPoint.name : 'Punktni tanlang'}
                            </span>
                            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isPointsOpen ? 'rotate-180' : ''}`} />
                          </div>

                          {isPointsOpen && (
                            <div className="absolute z-[2000] mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                              <div className="p-3 border-b border-slate-100 bg-slate-50">
                                <div className="relative">
                                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                  <input
                                    type="text"
                                    placeholder="Qidiruv..."
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7000ff]/20 focus:border-[#7000ff]"
                                    value={pointSearchQuery}
                                    onChange={(e) => setPointSearchQuery(e.target.value)}
                                    autoFocus
                                  />
                                </div>
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {pickupPoints
                                  .filter(p =>
                                    p.name.toLowerCase().includes(pointSearchQuery.toLowerCase()) ||
                                    p.address.toLowerCase().includes(pointSearchQuery.toLowerCase())
                                  )
                                  .map((point) => (
                                    <div
                                      key={point.id}
                                      className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${selectedPickupPoint?.id === point.id ? 'bg-[#7000ff]/5 border-l-4 border-l-[#7000ff]' : ''}`}
                                      onClick={() => {
                                        setSelectedPickupPoint(point);
                                        setIsPointsOpen(false);
                                        setPointSearchQuery('');
                                      }}
                                    >
                                      <div className="font-bold text-slate-900 text-sm">{point.name}</div>
                                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{point.address}</div>
                                    </div>
                                  ))}
                                {pickupPoints.filter(p =>
                                  p.name.toLowerCase().includes(pointSearchQuery.toLowerCase()) ||
                                  p.address.toLowerCase().includes(pointSearchQuery.toLowerCase())
                                ).length === 0 && (
                                    <div className="px-4 py-8 text-center text-slate-400 text-sm">
                                      Hech narsa topilmadi
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedPickupPoint && (
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <h4 className="font-bold text-slate-900 text-sm">{selectedPickupPoint.name}</h4>
                            <p className="text-xs text-slate-600 mt-1">{selectedPickupPoint.address}</p>
                          </div>
                          <div className="h-60 rounded-lg overflow-hidden border border-slate-200">
                            <Map
                              center={[selectedPickupPoint.lat, selectedPickupPoint.lng]}
                              zoom={15}
                              readOnly={true}
                              markers={pickupPoints.map(p => ({
                                lat: p.lat,
                                lng: p.lng,
                                label: p.name
                              }))}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#7000ff]/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-[#7000ff]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  To'lov usuli
                </h2>
              </div>
              <PaymentMethod
                selected={selectedPaymentMethod}
                onSelect={setSelectedPaymentMethod}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Buyurtma
              </h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="flex-1">
                      <p className="text-slate-900 line-clamp-1">
                        {item.variant?.product?.name || "Noma'lum mahsulot"}
                      </p>
                      <p className="text-slate-500">
                        {item.quantity} x{' '}
                        {(item.variant.discountPrice || item.variant.price).toLocaleString('uz-UZ')}{' '}
                        so'm
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {((item.variant.discountPrice || item.variant.price) * item.quantity).toLocaleString('uz-UZ')}{' '}
                      so'm
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-slate-700">
                  <span>Mahsulotlar ({itemCount} ta):</span>
                  <span>{totalAmount.toLocaleString('uz-UZ')} so'm</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Yetkazib berish:</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {deliveryFee === 0 ? 'Bepul' : `${deliveryFee.toLocaleString('uz-UZ')} so'm`}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-slate-900">
                  <span>Jami:</span>
                  <span className="text-[#7000ff]">
                    {finalTotal.toLocaleString('uz-UZ')} so'm
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || (deliveryType === 'PICKUP' && !selectedPickupPoint)}
                className="w-full bg-[#7000ff] hover:bg-[#5c00d9] text-white py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-6 w-6" />
                Buyurtmani tasdiqlash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
