import mongoose from "mongoose";

const connectDB = async () => {
   try {
      mongoose.connection.on('connected', () => {
         console.log("Database connected!");
      })
      mongoose.connection.on('error', (error) => {
         console.log("Database connection error: ", error);
      })
      await mongoose.connect(process.env.MONGODB_URI)
   } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1);  // Optionally exit the process if the connection fails
   }
}

export default connectDB;
