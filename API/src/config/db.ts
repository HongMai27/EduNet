import mongoose from "mongoose";

const connectDB = async () => {
    const PORT = process.env.PORT || 5000;
    const MONGODB_URI = process.env.MONGODB_URI || '';
    
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('Connected to MongoDB hihi'))
      .catch(err => console.error('Could not connect to MongoDB:', err));
    
};

export default connectDB;
