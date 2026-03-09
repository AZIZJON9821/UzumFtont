import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api/wishlist';
import type { Wishlist, Product } from '@/lib/types';
import { showToast } from '@/components/ui/Toast';

export const WISHLIST_QUERY_KEY = ['wishlist'];

// Wishlist ma'lumotlarini olish uchun hook
export function useWishlistQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: WISHLIST_QUERY_KEY,
        queryFn: wishlistApi.get,
        enabled,
        staleTime: 5 * 60 * 1000, // 5 daqiqa keshda saqlash
    });
}

// Toggle (qo'shish/o'chirish) uchun optimistic hook
export function useWishlistMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => wishlistApi.toggle(productId),

        // Optimistic Update boshlanishi
        onMutate: async (productId) => {
            // 1. Joriy so'rovlarni to'xtatish
            await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });

            // 2. Keshdagi eski holatni saqlab qolish (rollback uchun)
            const previousWishlist = queryClient.getQueryData<Wishlist>(WISHLIST_QUERY_KEY);

            // 3. Keshni optimistic ravishda yangilash
            if (previousWishlist) {
                const isCurrentlyIn = previousWishlist.products.some(p => p.id === productId);

                let newProducts;
                if (isCurrentlyIn) {
                    // O'chirish
                    newProducts = previousWishlist.products.filter(p => p.id !== productId);
                } else {
                    // Qo'shish (Vaqtinchalik qidirib topish qiyin bo'lgani uchun dummy product yoki shunchaki state'ni o'zgartirish)
                    // Bizda faqat productId bor, lekin UI uchun shunchaki isCached bo'lishi kifoya
                    // Real produktni backend'dan kelishini kutamiz, lekin UI da isLiked true bo'lib turadi
                    newProducts = [...previousWishlist.products, { id: productId } as Product];
                }

                queryClient.setQueryData(WISHLIST_QUERY_KEY, {
                    ...previousWishlist,
                    products: newProducts,
                });
            }

            return { previousWishlist };
        },

        // Xatolik bo'lsa orqaga qaytarish
        onError: (err, productId, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previousWishlist);
            }
            showToast('Xatolik yuz berdi. Iltimos qaytadan urunib ko\'ring.', 'error');
        },

        // Har qanday holatda keshni yangilash (refetch)
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
        },
    });
}
