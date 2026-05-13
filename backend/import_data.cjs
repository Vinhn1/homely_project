const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/test';
const DATA_PATH = 'C:/Users/ADMIN/.gemini/antigravity/brain/0a03a551-839b-4d6a-875d-0eae763c00af/scratch/data.json';

async function importData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URL);
        console.log('Connected successfully');

        const rawData = fs.readFileSync(DATA_PATH, 'utf8');
        const data = JSON.parse(rawData);

        // Transform $oid to ObjectId
        const transform = (obj) => {
            if (Array.isArray(obj)) return obj.map(transform);
            if (obj && typeof obj === 'object') {
                if (obj.$oid) return new mongoose.Types.ObjectId(obj.$oid);
                const newObj = {};
                for (const key in obj) {
                    newObj[key] = transform(obj[key]);
                }
                return newObj;
            }
            return obj;
        };

        const transformedData = transform(data);

        console.log(`Importing ${transformedData.length} records...`);
        const db = mongoose.connection.db;
        const collection = db.collection('properties');
        
        await collection.insertMany(transformedData);
        console.log('Import completed successfully');
        
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

importData();
