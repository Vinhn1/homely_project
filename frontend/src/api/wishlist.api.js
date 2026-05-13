import axiosInstance from './axiosInstance';

export const wishlistApi = {
    getWishlist: () => axiosInstance.get('/wishlist'),
    toggle: (propertyId) => axiosInstance.post(`/wishlist/toggle/${propertyId}`),
    check: (propertyId) => axiosInstance.get(`/wishlist/check/${propertyId}`)
};
