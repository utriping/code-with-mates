import mongoose from "mongoose";
const connectionStatus = {};

export const connectDb = async () => {
  if (connectionStatus.isConnected) {
    console.log("The database is already connected");
    return;
  }
  try {
    const res = await mongoose.connect(process.env.MONGODB_URI);
    connectionStatus.isConnected = res.connection[0].readyState;
  } catch (err) {
    console.err("Failed to connect to Database \n", err);
    process.exit(1);
  }
};

