import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import AppError from './utils/appError.js';
import catchAsync from './utils/catchAsync.js';
import authRouter from './modules/auth/auth.routes.js';
import cors from 'cors';



connectDB();

const app = express();
// Đọc dữ liệu json từ client gửi lên 
app.use(express.json());

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


app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Backend đang chạy trên cổng ${port}`)
})