import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js"
import connectToMongoDB from "./DB/connectToMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json())//to parse the incoming requests with JSON payload (from req.body)

app.use("/api/auth",authRoutes)

app.listen(PORT, () => {
  connectToMongoDB()
  console.log(`Server is Running on port ${PORT}`);
});
