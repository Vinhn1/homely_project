import { create } from 'zustand';
import { wishlistApi } from '../api/wishlist.api';
import { toast } from 'sonner';

export const useWishlistStore = create((set, get) => ({
    wishlist: [],
    loading: false,

    fetchWishlist: async () => {
        set({ loading: true });
        try {
            const res = await wishlistApi.getWishlist();
            set({ wishlist: res.data.data.wishlist, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    toggle: async (propertyId) => {
        try {
            const res = await wishlistApi.toggle(propertyId);
            const { saved } = res.data.data;
            if (saved) {
                toast.success('Đã lưu vào danh sách yêu thích');
            } else {
                toast.info('Đã xóa khỏi danh sách yêu thích');
            }
            // Cập nhật state local
            set(state => ({
                wishlist: saved
                    ? [...state.wishlist, { _id: propertyId }]
                    : state.wishlist.filter(p => (p._id || p).toString() !== propertyId.toString())
            }));
            return saved;
        } catch (err) {
            toast.error('Không thể cập nhật danh sách yêu thích');
            return null;
        }
    },

    isSaved: (propertyId) => {
        return get().wishlist.some(p => (p._id || p).toString() === propertyId.toString());
    }
}));
