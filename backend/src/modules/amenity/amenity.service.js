import Amenity from './amenity.model.js';

export const getAllAmenities = async () => {
    return await Amenity.find({ isActive: true }).sort('category name');
};

export const createAmenity = async (data) => {
    return await Amenity.create(data);
};
