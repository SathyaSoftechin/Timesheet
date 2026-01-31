const mongoose = require('mongoose');

const connectDB = async () => {
  const URI = process.env.DB_CONNECTION_STRING;

  if (!URI) {
    console.error('❌ DB_CONNECTION_STRING is missing in .env');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    console.log('✅ SUCCESSFULLY CONNECTED TO DATABASE');
  } catch (error) {
    console.error('❌ CONNECTION TO DATABASE FAILED!');
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
