import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const dbConnection = async () => {
  const MONGO_URI = process.env.DB_URI;

  if (!MONGO_URI) {
    console.error("[SYSTEM] ERROR: DB_URI is not defined in .env file");
    throw new Error("DB_URI is missing in environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((m) => {
      console.log("[SYSTEM] : DATABASE is CONNECTED.");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err: any) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
};
