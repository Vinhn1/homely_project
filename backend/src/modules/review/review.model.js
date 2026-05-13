import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Đánh giá phải thuộc về một bất động sản']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Đánh giá phải thuộc về một người dùng']
    },
    rating: {
        type: Number,
        required: [true, 'Vui lòng chọn số sao'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Nội dung đánh giá không được để trống'],
        trim: true,
        maxlength: [500, 'Nội dung đánh giá không được quá 500 ký tự']
    }
}, { timestamps: true });

// Mỗi user chỉ được đánh giá 1 lần cho mỗi property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
