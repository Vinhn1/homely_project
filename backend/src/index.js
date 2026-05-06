import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import AppError from './utils/appError.js';


connectDB();

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/test-error', (req, res, next) => {
    console.log('Đã nhận req test-error'); 
    next(new AppError('Lỗi thử nghiệm!', 400))
})


app.use(errorMiddleware)

app.listen(port, () => {
    console.log(`Backend đang chạy trên cổng ${port}`)
})