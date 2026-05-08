/**
 * @file property.service.js
 * @description Logic nghiệp vụ cho module Property (CRUD bài đăng nhà/phòng trọ)
 */
import Property from './property.model.js';
import AppError from '../../utils/appError.js';


// ================================
// CREATE — Tạo bài đăng mới
// ================================
export const createProperty = async (data, ownerId) => {

    // Gán owner từ user đang đăng nhập (không nhận từ client → tránh giả mạo)
    const property = await Property.create({
        ...data,
        owner: ownerId
    });

    return property;
};


// ================================
// GET ALL — Danh sách + Filter + Pagination
// ================================
export const getAllProperties = async (queryParams) => {

    const {
        page = 1,
        limit = 12,
        city,
        minPrice,
        maxPrice,
        category,
        status,
        sort = '-createdAt'   // Mặc định: mới nhất lên đầu
    } = queryParams;

    // Xây dựng filter object động
    const filter = { listingStatus: 'active' };

    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
        Property.find(filter)
            .populate('owner', 'displayName email')
            .populate('category', 'name')
            .populate('amenities', 'name icon')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit)),
        Property.countDocuments(filter)
    ]);

    return {
        properties,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        }
    };
};


// ================================
// GET ONE — Chi tiết 1 bài đăng
// ================================
export const getPropertyById = async (id) => {

    const property = await Property.findById(id)
        .populate('owner', 'displayName email phone')
        .populate('category', 'name icon')
        .populate('amenities', 'name icon')
        .populate('location.district', 'name');

    if (!property) {
        throw new AppError('Không tìm thấy bài đăng này', 404);
    }

    // Tăng view count mỗi khi có người xem
    await Property.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return property;
};


// ================================
// UPDATE — Cập nhật bài đăng
// ================================
export const updateProperty = async (id, data, requesterId) => {

    const property = await Property.findById(id);

    if (!property) {
        throw new AppError('Không tìm thấy bài đăng này', 404);
    }

    // Chỉ chủ sở hữu mới được sửa
    if (property.owner.toString() !== requesterId.toString()) {
        throw new AppError('Bạn không có quyền chỉnh sửa bài đăng này', 403);
    }

    const updated = await Property.findByIdAndUpdate(
        id,
        { ...data },
        { new: true, runValidators: true }
    );

    return updated;
};


// ================================
// DELETE — Xóa bài đăng
// ================================
export const deleteProperty = async (id, requesterId) => {

    const property = await Property.findById(id);

    if (!property) {
        throw new AppError('Không tìm thấy bài đăng này', 404);
    }

    // Chỉ chủ sở hữu mới được xóa
    if (property.owner.toString() !== requesterId.toString()) {
        throw new AppError('Bạn không có quyền xóa bài đăng này', 403);
    }

    await Property.findByIdAndDelete(id);

    return { message: 'Đã xóa bài đăng thành công' };
};


// ================================
// MY LISTINGS — Bài đăng của tôi
// ================================
export const getMyProperties = async (ownerId, queryParams) => {

    const { page = 1, limit = 10 } = queryParams;
    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
        Property.find({ owner: ownerId })
            .populate('category', 'name')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit)),
        Property.countDocuments({ owner: ownerId })
    ]);

    return {
        properties,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        }
    };
};
