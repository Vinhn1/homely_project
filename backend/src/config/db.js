import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Kết nối CSDL thành công!");
    }catch(error){
        console.log("Lỗi khi kết nối cơ sở dữ liệu", error);
        process.exit();
    }
}