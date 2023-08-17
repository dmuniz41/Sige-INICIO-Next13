import mongoose from "mongoose";

const { MONGODB_URL } = process.env;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL must be defined");
}

export const connectDB = async () => {
  const { connection } = await mongoose.connect(MONGODB_URL);
  
  try {
    if (connection.readyState === 1) {
      console.log("DB Connected");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
};
