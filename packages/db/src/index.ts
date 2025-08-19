import mongoose from "mongoose";
export * from "./modals";

export async function connectDb() {
  await mongoose.connect(process.env.MONGODB_URL!);
}
