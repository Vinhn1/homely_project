import multer from 'multer';
import { storage, propertyStorage } from '../config/cloudinary.js';

console.log('Upload middleware loaded');

const upload = multer({ storage: storage });
const propertyUpload = multer({ storage: propertyStorage });

export const uploadAvatar = upload.single('avatar');
export const uploadImages = propertyUpload.array('images', 10);
