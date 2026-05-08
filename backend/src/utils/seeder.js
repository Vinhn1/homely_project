import mongoose from 'mongoose';
import 'dotenv/config';
import Category from '../modules/category/category.model.js';
import Amenity from '../modules/amenity/amenity.model.js';
import District from '../modules/district/district.model.js';
import { connectDB } from '../config/db.js';

const seedData = async () => {
    try {
        await connectDB();

        // Xóa dữ liệu cũ (Tùy chọn - cẩn thận khi dùng)
        // await Category.deleteMany();
        // await Amenity.deleteMany();
        // await District.deleteMany();

        // 1. Seed Categories
        const categories = [
            { name: 'Phòng trọ', icon: 'Home', description: 'Phòng trọ sinh viên, công nhân' },
            { name: 'Căn hộ', icon: 'Building', description: 'Căn hộ chung cư, mini' },
            { name: 'Nhà nguyên căn', icon: 'Key', description: 'Thuê nguyên căn hộ gia đình' },
            { name: 'Mặt bằng', icon: 'Store', description: 'Kinh doanh, văn phòng' }
        ];
        await Category.insertMany(categories);
        console.log('✅ Đã seed Categories');

        // 2. Seed Amenities
        const amenities = [
            { name: 'Wifi', icon: 'Wifi', category: 'Tiện ích chung' },
            { name: 'Máy giặt', icon: 'Wind', category: 'Tiện ích chung' },
            { name: 'Điều hòa', icon: 'Thermometer', category: 'Nội thất' },
            { name: 'Bãi xe', icon: 'ParkingCircle', category: 'Tiện ích chung' },
            { name: 'Bảo vệ 24/7', icon: 'ShieldCheck', category: 'An ninh' },
            { name: 'Giờ giấc tự do', icon: 'Clock', category: 'An ninh' }
        ];
        await Amenity.insertMany(amenities);
        console.log('✅ Đã seed Amenities');

        // 3. Seed Districts (Vĩnh Long)
        const districts = [
            { name: 'TP. Vĩnh Long', city: 'Vĩnh Long' },
            { name: 'Long Hồ', city: 'Vĩnh Long' },
            { name: 'Mang Thít', city: 'Vĩnh Long' },
            { name: 'Vũng Liêm', city: 'Vĩnh Long' },
            { name: 'Tam Bình', city: 'Vĩnh Long' },
            { name: 'Trà Ôn', city: 'Vĩnh Long' },
            { name: 'Bình Minh', city: 'Vĩnh Long' },
            { name: 'Bình Tân', city: 'Vĩnh Long' }
        ];
        await District.insertMany(districts);
        console.log('✅ Đã seed Districts');

        console.log('🚀 Tất cả dữ liệu mẫu đã được tạo thành công!');
        process.exit();
    } catch (error) {
        console.error('❌ Lỗi Seeding:', error);
        process.exit(1);
    }
};

seedData();
