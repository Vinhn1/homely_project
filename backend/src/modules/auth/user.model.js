import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        required: [true, 'Email không được để trống'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Vui lòng nhập đúng định dạng email']
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        sparse: true,
    },
    // Trạng thái yêu cầu trở thành chủ nhà (null = chưa yêu cầu)
    ownerRequestStatus: {
        type: String,
        enum: [null, 'pending', 'approved', 'rejected'],
        default: null
    },
    // Admin có thể khóa tài khoản
    isBanned: {
        type: Boolean,
        default: false
    },
    // Lý do bị khóa
    banReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})


// Hàm tự động Hash Mật Khẩu (Pre-save Middleware)
UserSchema.pre('save', async function() {
    // Chỉ hash lại mk nếu nó bị thay đổi (hoặc tạo mới)
    if(!this.isModified('password'))
        return;

    // Hash mk với độ phức tạp salt là 12
    this.password = await bcrypt.hash(this.password, 12);
})

// Hàm so sánh mật khẩu (Instance Method)
UserSchema.methods.comparePassword = async function(hashedPassword, userPassword) {
    return await bcrypt.compare(hashedPassword, userPassword);
};

const User = mongoose.model('User', UserSchema);
export default User;