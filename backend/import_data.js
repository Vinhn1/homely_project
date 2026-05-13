import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const DATA_PATH = 'C:/Users/ADMIN/.gemini/antigravity/brain/0a03a551-839b-4d6a-875d-0eae763c00af/scratch/data.json';

async function importData() {
  if (!MONGO_URL) {
    console.error('MONGO_URL not found in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const collection = mongoose.connection.collection('properties');
    
    const transformedData = data.map(doc => {
      const transform = (obj) => {
        if (Array.isArray(obj)) return obj.map(transform);
        if (obj && typeof obj === 'object') {
          if (obj.$oid) return new mongoose.Types.ObjectId(obj.$oid);
          for (let key in obj) {
            obj[key] = transform(obj[key]);
          }
        }
        return obj;
      };
      return transform(doc);
    });

    // Delete existing test property if any (optional, but good for cleanup)
    await collection.deleteMany({ title: "Test Property" });

    const result = await collection.insertMany(transformedData);
    console.log(`Successfully inserted ${result.insertedCount} properties`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
