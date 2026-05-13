/**
 * @file property.model.js
 * @description Schema cho bài đăng bất động sản (phòng trọ, căn hộ, nhà nguyên căn...)
 */
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    // ===== Thông tin cơ bản =====
    title: {
        type: String,
        required: [true, 'Tiêu đề bài đăng là bắt buộc'],
        maxlength: [100, 'Tiêu đề không được quá 100 ký tự'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Mô tả bài đăng là bắt buộc'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Giá thuê là bắt buộc'],
        min: [0, 'Giá không thể âm']
    },

    // ===== Phân loại & Trạng thái =====
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Danh mục là bắt buộc']
    },
    // Trạng thái phòng (cho thuê được chưa)
    status: {
        type: String,
        enum: ['Còn phòng', 'Đã thuê', 'Bảo trì'],
        default: 'Còn phòng'
    },
    // Trạng thái bài đăng (owner quản lý)
    listingStatus: {
        type: String,
        enum: ['pending', 'active', 'hidden', 'expired'],
        default: 'pending'
    },
    // Ngày hết hạn tin đăng (30 ngày)
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },

    // ===== Badges =====
    isVerified: { type: Boolean, default: false },
    isPopular:  { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },

    // ===== Thông số kỹ thuật =====
    area: {
        type: Number,
        required: [true, 'Diện tích là bắt buộc'],
        min: [1, 'Diện tích phải lớn hơn 0']
    },
    bedroom:  { type: Number, default: 1 },
    bathroom: { type: Number, default: 1 },
    floor:    { type: Number, default: 1 },
    minLease: { type: String, default: '6 Tháng' },
    capacity: { type: Number, default: 1 },
    security: { type: String, default: '24/7' },
    legalDocs:{ type: String, default: 'Hợp đồng thuê' },

    // ===== Tiện ích =====
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity'
    }],

    // ===== Hình ảnh (lưu URL từ Cloudinary) =====
    images: [{ type: String }],

    // ===== Vị trí =====
    location: {
        address: {
            type: String,
            required: [true, 'Địa chỉ là bắt buộc']
        },
        district: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'District'
        },
        city: {
            type: String,
            required: true,
            default: 'Vĩnh Long'
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },

    // ===== Chủ sở hữu =====
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Chủ sở hữu là bắt buộc']
    },

    // ===== Thống kê =====
    viewCount:   { type: Number, default: 0 },
    rating:      { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }

}, { timestamps: true });

// Index để tối ưu các query phổ biến
propertySchema.index({ 'location.city': 1, listingStatus: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ createdAt: -1 });

const Property = mongoose.model('Property', propertySchema);
export default Property;
