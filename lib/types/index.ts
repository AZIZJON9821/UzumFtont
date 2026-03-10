// ==========================================
// USER & AUTH TYPES
// ==========================================
export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'MODERATOR' | 'COURIER' | 'SUPER_ADMIN';
    isActive: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    createdAt: string;
    updatedAt?: string;
}

// ==========================================
// PRODUCT TYPES
// ==========================================
export interface Product {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    category?: Category;
    brandId?: string;
    brand?: Brand;
    rating: number;
    reviewCount: number;
    variants: ProductVariant[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariant {
    id: string;
    productId: string;
    product?: Product;
    sku: string;
    colorId?: string;
    color?: Color;
    sizeId?: string;
    size?: Size;
    price: number;
    discountPrice?: number;
    stock: number;
    isActive: boolean;
    images: ProductImage[];
}

export interface ProductImage {
    id: string;
    variantId: string;
    url: string;
    isMain: boolean;
    order: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    parentId?: string;
    children?: Category[];
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
}

export interface Color {
    id: string;
    name: string;
    hexCode: string;
}

export interface Size {
    id: string;
    name: string;
    code: string;
}

// ==========================================
// CART TYPES
// ==========================================
export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: string;
    cartId: string;
    variantId: string;
    variant: ProductVariant;
    quantity: number;
    createdAt: string;
}

export interface AddToCartDto {
    variantId: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

// ==========================================
// ORDER TYPES
// ==========================================
export interface Order {
    id: string;
    userId: string;
    user?: User;
    addressId: string;
    address?: Address;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    variantId: string;
    variant?: ProductVariant;
    quantity: number;
    price: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'CLICK' | 'PAYME';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface CreateOrderDto {
    addressId: string;
    paymentMethod: PaymentMethod;
}

// ==========================================
// ADDRESS TYPES
// ==========================================
export interface Address {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    region: string;
    city: string;
    street: string;
    building: string;
    apartment?: string;
    zipCode?: string;
    isDefault: boolean;
    createdAt: string;
}

export interface CreateAddressDto {
    fullName: string;
    phone: string;
    region: string;
    city: string;
    street: string;
    building: string;
    apartment?: string;
    zipCode?: string;
    isDefault?: boolean;
}

// ==========================================
// WISHLIST TYPES
// ==========================================
export interface Wishlist {
    id: string;
    userId: string;
    products: Product[];
    createdAt: string;
}

// ==========================================
// REVIEW TYPES
// ==========================================
export interface Review {
    id: string;
    productId: string;
    userId: string;
    user?: User;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewDto {
    productId: string;
    rating: number;
    comment?: string;
}

// ==========================================
// FILTER & SORT TYPES
// ==========================================
export interface ProductFilters {
    categoryId?: string;
    brandId?: string;
    colorIds?: string[];
    sizeIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
    page?: number;
    limit?: number;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
