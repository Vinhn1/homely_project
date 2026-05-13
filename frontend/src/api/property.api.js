import axiosInstance from "./axiosInstance";

export const propertyApi = {
    getAllProperties: (params) => axiosInstance.get("/properties", { params }),
    getPropertyById: (id) => axiosInstance.get(`/properties/${id}`),
    createProperty: (data) => axiosInstance.post("/properties", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    updateProperty: (id, data) => axiosInstance.patch(`/properties/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    deleteProperty: (id) => axiosInstance.delete(`/properties/${id}`),
    getMyProperties: (params) => axiosInstance.get("/properties/user/my-listings", { params }),
    
    // Metadata
    getCategories: () => axiosInstance.get("/categories"),
    getAmenities: () => axiosInstance.get("/amenities"),
    getDistricts: () => axiosInstance.get("/districts"),
};
