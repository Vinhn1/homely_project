import District from './district.model.js';

export const getAllDistricts = async (city) => {
    const filter = { isActive: true };
    if (city) filter.city = city;
    return await District.find(filter).sort('name');
};

export const createDistrict = async (data) => {
    return await District.create(data);
};
