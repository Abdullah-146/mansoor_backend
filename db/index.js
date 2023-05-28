import mongoose from 'mongoose';

/**
 *
 */
const connectDB = async () => {
  try {
    const uri =
      process.env.NODE_ENV === 'development'
        ? `mongodb://localhost:27017/${process.env.DB_NAME}`
        : process.env.MONGO_URI;

    // let's connect to db now
    const dbOptions =
      process.env.NODE_ENV === 'development'
        ? {}
        : { useUnifiedTopology: true, useNewUrlParser: true };
    await mongoose.connect(uri, dbOptions);
    console.log('Connected to database.');
  } catch (error) {
    console.log('Failed connecting to Mongo DB.');
    process.exit(0);
  }
};

export { connectDB };
