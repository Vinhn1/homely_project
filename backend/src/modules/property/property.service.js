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
        district,
        minArea,
        keyword,
        sort = '-createdAt'   // Mặc định: mới nhất lên đầu
    } = queryParams;

    // Xây dựng filter object động
    const filter = {
        $and: [
            {
                $or: [
                    { listingStatus: 'active' },
                    { listingStatus: { $exists: false } }
                ]
            }
        ]
    };

    if (city) filter.$and.push({ 'location.city': { $regex: city, $options: 'i' } });
    if (district) filter.$and.push({ 'location.district': district });
    if (category) filter.$and.push({ category: category });
    if (status) filter.$and.push({ status: status });
    
    if (minPrice || maxPrice) {
        const priceFilter = {};
        if (minPrice) priceFilter.$gte = Number(minPrice);
        if (maxPrice) priceFilter.$lte = Number(maxPrice);
        filter.$and.push({ price: priceFilter });
    }

    if (minArea) {
        filter.$and.push({ area: { $gte: Number(minArea) } });
    }

    // Keyword search (Title or Description)
    if (keyword) {
        filter.$and.push({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { 'location.address': { $regex: keyword, $options: 'i' } }
            ]
        });
    }

    // If $and only has the default status filter, simplify it back to a flat object if possible
    // But keeping it as $and is safer for dynamic additions.


    const skip = (Number(page) - 1) * Number(limit);

    // Xử lý sort
    let sortObj = {};
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'oldest') sortObj = { createdAt: 1 };
    else sortObj = { createdAt: -1 };

    const [properties, total] = await Promise.all([
        Property.find(filter)
            .populate('owner', 'displayName email')
            .populate('category', 'name')
            .populate('amenities', 'name icon')
            .populate('location.district', 'name')
            .sort(sortObj)
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
export const getPropertyById = async (id, requester) => {

    const property = await Property.findById(id)
        .populate('owner', 'displayName email phone')
        .populate('category', 'name icon')
        .populate('amenities', 'name icon')
        .populate('location.district', 'name');

    if (!property) {
        throw new AppError('Không tìm thấy bài đăng này', 404);
    }

    const isOwner = requester && property.owner?._id?.toString() === requester._id.toString();
    const isAdmin = requester?.role === 'admin';
    const isPubliclyVisible = property.listingStatus === 'active' || !property.listingStatus;

    if (!isPubliclyVisible && !isOwner && !isAdmin) {
        throw new AppError('Bài đăng này chưa được duyệt hoặc đã bị ẩn', 404);
    }

    // Tăng view count mỗi khi có người xem
    if (isPubliclyVisible) {
        await Property.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    }

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
        { ...data, listingStatus: 'pending' },
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
