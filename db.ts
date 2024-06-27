import mongoose from 'mongoose';

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster1.3vofqf9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

if (!connectionString) {
    throw new Error('Please define the MONGO_DB_USERNAME and MONGO_DB_PASSWORD environment variables');
}

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(connectionString);
    } catch (error) {
        console.log('Error conecting to MongoDB: ', error)
    }
}