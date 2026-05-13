import { create } from "zustand";
import { reviewApi } from "../api/review.api";
import { toast } from "sonner";

export const useReviewStore = create((set, get) => ({
    reviews: [],
    loading: false,
    error: null,

    fetchReviews: async (propertyId) => {
        set({ loading: true });
        try {
            const res = await reviewApi.getReviewsByProperty(propertyId);
            set({ reviews: res.data.data.reviews || [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải đánh giá", loading: false });
        }
    },

    createReview: async (reviewData) => {
        set({ loading: true });
        try {
            const res = await reviewApi.createReview(reviewData);
            const newReview = res.data.data.review;
            set((state) => ({ 
                reviews: [newReview, ...state.reviews],
                loading: false 
            }));
            toast.success("Đánh giá của bạn đã được gửi!");
            return newReview;
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || "Gửi đánh giá thất bại";
            toast.error(message);
            throw error;
        }
    },

    deleteReview: async (reviewId) => {
        try {
            await reviewApi.deleteReview(reviewId);
            set((state) => ({
                reviews: state.reviews.filter((r) => r._id !== reviewId),
            }));
            toast.success("Đã xóa đánh giá");
        } catch (error) {
            toast.error(error.response?.data?.message || "Xóa đánh giá thất bại");
        }
    }
}));
