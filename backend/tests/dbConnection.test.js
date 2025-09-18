import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import connectDB from "../src/config/db.js";

jest.setTimeout(15000); // allow time for Atlas connection

describe("MongoDB Connection", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should connect to MongoDB Atlas successfully", async () => {
    const conn = await connectDB();
    expect(conn.connection.readyState).toBe(1); // 1 = connected
  });
});
