import catchAsync from '../../utils/catchAsync.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as reviewService from './review.service.js';

export const createReview = catchAsync(async (req, res) => {
    const reviewData = {
        ...req.body,
        user: req.user.id
    };

    const review = await reviewService.createReview(reviewData);

    return ApiResponse.success(res, 'Gửi đánh giá thành công', { review }, 201);
});

export const getPropertyReviews = catchAsync(async (req, res) => {
    const reviews = await reviewService.getPropertyReviews(req.params.propertyId);

    return ApiResponse.success(res, 'Lấy danh sách đánh giá thành công', { reviews }, 200);
});

export const deleteReview = catchAsync(async (req, res) => {
    const result = await reviewService.deleteReview(req.params.id, req.user.id);

    return ApiResponse.success(res, result.message, null, 200);
});
