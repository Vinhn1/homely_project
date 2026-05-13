import { create } from "zustand";
import { bookingApi } from "../api/booking.api";
import { toast } from "sonner";

export const useBookingStore = create((set, get) => ({
    myBookings: [],
    propertyBookings: [],
    loading: false,
    error: null,

    fetchMyBookings: async () => {
        set({ loading: true });
        try {
            const res = await bookingApi.getMyBookings();
            set({ myBookings: res.data.data.bookings || [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải danh sách đặt phòng", loading: false });
        }
    },

    fetchPropertyBookings: async (propertyId) => {
        set({ loading: true });
        try {
            const res = await bookingApi.getPropertyBookings(propertyId);
            set({ propertyBookings: res.data.data.bookings || [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải danh sách yêu cầu đặt phòng", loading: false });
        }
    },

    fetchOwnerRequests: async () => {
        set({ loading: true });
        try {
            const res = await bookingApi.getOwnerRequests();
            set({ propertyBookings: res.data.data.bookings || [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải danh sách yêu cầu thuê", loading: false });
        }
    },

    createBooking: async (bookingData) => {
        set({ loading: true });
        try {
            const res = await bookingApi.createBooking(bookingData);
            const newBooking = res.data.data.booking;
            set((state) => ({ 
                myBookings: [newBooking, ...state.myBookings],
                loading: false 
            }));
            toast.success("Yêu cầu đặt phòng đã được gửi!");
            return newBooking;
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || "Gửi yêu cầu đặt phòng thất bại";
            toast.error(message);
            throw error;
        }
    },

    updateBookingStatus: async (bookingId, status) => {
        try {
            const res = await bookingApi.updateBookingStatus(bookingId, status);
            const updatedBooking = res.data.data.booking;
            set((state) => ({
                propertyBookings: state.propertyBookings.map((b) => 
                    b._id === bookingId ? updatedBooking : b
                ),
            }));
            toast.success(`Đã ${status === 'confirmed' ? 'chấp nhận' : 'từ chối'} yêu cầu đặt phòng`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
        }
    }
}));
