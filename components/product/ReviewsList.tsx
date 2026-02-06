"use client";

import React, { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api/reviews';
import { useAuth } from '@/components/providers/AuthProvider';
import { showToast } from '../ui/Toast';
import type { Review } from '@/lib/types';
import { Star, User } from 'lucide-react';

interface ReviewsListProps {
    productId: string;
}

export function ReviewsList({ productId }: ReviewsListProps) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewsApi.getByProduct(productId);
            setReviews(data);
        } catch (error) {
            console.error('Reviews load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showToast('Sharh qoldirish uchun tizimga kiring', 'error');
            return;
        }

        try {
            setSubmitting(true);
            await reviewsApi.create({ productId, rating, comment });
            showToast('Sharh qo\'shildi!', 'success');
            setComment('');
            setRating(5);
            setShowForm(false);
            await loadReviews();
        } catch (error) {
            showToast('Xatolik yuz berdi', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                    Sharhlar ({reviews.length})
                </h2>
                {user && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Sharh qoldirish
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-4 mb-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Reyting</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Izoh</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#7000ff] focus:border-transparent"
                            placeholder="Mahsulot haqida fikringizni yozing..."
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Yuklanmoqda...' : 'Yuborish'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                                <div className="flex-1">
                                    <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                                    <div className="h-3 bg-slate-200 rounded w-24" />
                                </div>
                            </div>
                            <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                            <div className="h-4 bg-slate-200 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-500">Hali sharhlar yo'q. Birinchi bo'lib sharh qoldiring!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-slate-200 pb-6 last:border-0">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                    {review.user?.fullName?.[0] || <User className="h-5 w-5 text-slate-400" />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{review.user?.fullName || 'Foydalanuvchi'}</p>
                                    <p className="text-sm text-slate-500">
                                        {new Date(review.createdAt).toLocaleDateString('uz-UZ')}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Comment */}
                            {review.comment && (
                                <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
