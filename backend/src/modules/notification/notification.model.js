import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['new_message', 'booking_request', 'booking_approved', 'booking_rejected',
               'property_approved', 'property_rejected', 'new_review', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    // Link điều hướng khi click
    link: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    // Dữ liệu tham chiếu tuỳ loại thông báo
    refId: {
        type: mongoose.Schema.Types.ObjectId
    },
    refModel: {
        type: String,
        enum: ['Property', 'Booking', 'Message', 'Conversation']
    }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
