import Review from './review.model.js';
import Property from '../property/property.model.js';
import AppError from '../../utils/appError.js';

export const createReview = async (reviewData) => {
    const { property: propertyId, rating } = reviewData;

    // 1. Tạo review
    const review = await Review.create(reviewData);

    // 2. Cập nhật rating trung bình cho Property
    // Tính toán lại rating và reviewCount (Đơn giản hóa: có thể dùng aggregation pipeline cho chính xác hơn)
    const reviews = await Review.find({ property: propertyId });
    const reviewCount = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount;

    await Property.findByIdAndUpdate(propertyId, {
        rating: avgRating.toFixed(1),
        reviewCount: reviewCount
    });

    return review;
};

export const getPropertyReviews = async (propertyId) => {
    return await Review.find({ property: propertyId })
        .populate('user', 'displayName avatarUrl')
        .sort('-createdAt');
};

export const deleteReview = async (reviewId, userId) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new AppError('Không tìm thấy đánh giá', 404);
    }

    if (review.user.toString() !== userId.toString()) {
        throw new AppError('Bạn không có quyền xóa đánh giá này', 403);
    }

    const propertyId = review.property;
    await Review.findByIdAndDelete(reviewId);

    // Cập nhật lại rating của Property sau khi xóa
    const reviews = await Review.find({ property: propertyId });
    const reviewCount = reviews.length;
    const avgRating = reviewCount > 0 
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviewCount 
        : 0;

    await Property.findByIdAndUpdate(propertyId, {
        rating: avgRating.toFixed(1),
        reviewCount: reviewCount
    });

    return { message: 'Đã xóa đánh giá thành công' };
};
