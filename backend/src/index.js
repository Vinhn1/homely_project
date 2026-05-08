import express from 'express';
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
import cors from 'cors';



connectDB();

const app = express();
// Đọc dữ liệu json từ client gửi lên 
app.use(express.json());
// Parse cookie từ request header → req.cookies sẽ có giá trị
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.get('/test-error', catchAsync( async (req, res, next) => {
    const user = await User.find();
    console.log('Đã nhận req test-error'); 
    next(new AppError('Lỗi thử nghiệm!', 400))
}))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/amenities', amenityRouter);
app.use('/api/v1/districts', districtRouter);


app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Backend đang chạy trên cổng ${port}`)
})