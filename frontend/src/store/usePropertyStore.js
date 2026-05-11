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
            set({ properties: res.data.data.properties || [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Lỗi tải danh sách", loading: false });
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
            // Backend trả về { property: {...} }
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
    }
}));
