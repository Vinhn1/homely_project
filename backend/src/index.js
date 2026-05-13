import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import AppError from './utils/appError.js';
import catchAsync from './utils/catchAsync.js';
import authRouter from './modules/auth/auth.routes.js';
import propertyRouter from './modules/property/property.routes.js';
import categoryRouter from './modules/category/category.routes.js';
import amenityRouter from './modules/amenity/amenity.routes.js';
import districtRouter from './modules/district/district.routes.js';
import reviewRouter from './modules/review/review.routes.js';
import bookingRouter from './modules/booking/booking.routes.js';
import wishlistRouter from './modules/wishlist/wishlist.routes.js';
import chatRouter from './modules/chat/chat.routes.js';
import notificationRouter from './modules/notification/notification.routes.js';
import reportRouter from './modules/report/report.routes.js';
import adminRouter from './modules/admin/admin.routes.js';
import cors from 'cors';

connectDB();

const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: [FRONTEND_URL, 'http://127.0.0.1:5173'],
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['polling', 'websocket'] // Đảm bảo hỗ trợ cả 2
});

// Debug handshake
io.engine.on("connection_error", (err) => {
    console.log("Socket Connection Error:", err.req);      // the request object
    console.log("Error code:", err.code);     // the error code, for example 1
    console.log("Error message:", err.message);  // the error message, for example "Session ID unknown"
    console.log("Error context:", err.context);  // some additional error context
});

// Gắn io vào app để dùng trong controllers
app.set('io', io);

// Map userId -> socketId để gửi notification cá nhân
const onlineUsers = new Map();

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected to socket: ${userId || 'anonymous'} (Socket ID: ${socket.id})`);
    
    if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.join(userId); // join room riêng theo userId
    }

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
        socket.leave(conversationId);
    });

    socket.on('disconnect', () => {
        if (userId) onlineUsers.delete(userId);
    });
});

// Middlewares
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use(cors({
    origin: [FRONTEND_URL, 'http://127.0.0.1:5173'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('TroTốt API is running!');
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/amenities', amenityRouter);
app.use('/api/v1/districts', districtRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/admin', adminRouter);

app.use(errorMiddleware);

httpServer.listen(port, () => {
    console.log(`Backend đang chạy trên cổng ${port}`);
});