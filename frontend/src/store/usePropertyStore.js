import { create } from "zustand";
import { propertyApi } from "../api/property.api";
import { toast } from "sonner";

export const usePropertyStore = create((set, get) => ({
    properties: [],
    currentProperty: null,
    categories: [],
    amenities: [],
    districts: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    },

    // Fetch metadata
    fetchMetadata: async () => {
        set({ loading: true });
        try {
            const [catRes, amenRes, distRes] = await Promise.all([
                propertyApi.getCategories(),
                propertyApi.getAmenities(),
                propertyApi.getDistricts()
            ]);
            
            // Backend trả về { categories: [...] }, { amenities: [...] }, { districts: [...] }
            set({ 
                categories: catRes.data.data.categories || [], 
                amenities: amenRes.data.data.amenities || [], 
                districts: distRes.data.data.districts || [],
                loading: false 
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải dữ liệu", loading: false });
            toast.error("Không thể tải thông tin danh mục");
        }
    },

    // Properties
    fetchProperties: async (params) => {
        set({ loading: true });
        try {
            const res = await propertyApi.getAllProperties(params);
            // Backend trả về { properties: [...], pagination: {...} }
            set({ 
                properties: res.data.data.properties || [], 
                pagination: res.data.data.pagination || { total: 0, page: 1, totalPages: 1 },
                loading: false 
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải danh sách", loading: false });
        }
    },
    
    fetchMyProperties: async (params) => {
        set({ loading: true });
        try {
            const res = await propertyApi.getMyProperties(params);
            set({ 
                properties: res.data.data.properties || [], 
                pagination: res.data.data.pagination || { total: 0, page: 1, totalPages: 1 },
                loading: false 
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải danh sách của bạn", loading: false });
        }
    },

    fetchPropertyById: async (id) => {
        set({ loading: true, currentProperty: null });
        try {
            const res = await propertyApi.getPropertyById(id);
            // Backend trả về { property: {...} }
            set({ currentProperty: res.data.data.property, loading: false });
        } catch (error) {
            const message = error.response?.data?.message || "Lỗi tải chi tiết tin đăng";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    createProperty: async (data) => {
        set({ loading: true });
        try {
            const res = await propertyApi.createProperty(data);
            const newProperty = res.data.data.property;
            set((state) => ({ 
                properties: [newProperty, ...state.properties],
                loading: false 
            }));
            toast.success("Đăng tin thành công!");
            return newProperty;
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || "Đăng tin thất bại";
            toast.error(message);
            throw error;
        }
    },

    updateProperty: async (id, data) => {
        set({ loading: true });
        try {
            const res = await propertyApi.updateProperty(id, data);
            const updatedProperty = res.data.data.property;
            set((state) => ({
                properties: state.properties.map(p => p._id === id ? updatedProperty : p),
                currentProperty: updatedProperty,
                loading: false
            }));
            toast.success("Cập nhật tin đăng thành công!");
            return updatedProperty;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Cập nhật thất bại");
            throw error;
        }
    },

    deleteProperty: async (id) => {
        set({ loading: true });
        try {
            await propertyApi.deleteProperty(id);
            set((state) => ({
                properties: state.properties.filter(p => p._id !== id),
                loading: false
            }));
            toast.success("Đã xóa tin đăng");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Xóa thất bại");
            throw error;
        }
    }
}));
