import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db.js';


connectDB();

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Backend đang chạy trên cổng ${port}`)
})