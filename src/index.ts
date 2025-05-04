import express from "express";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Use Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);

// Start Server
app.listen(3006, () => {
    console.log("🚀 Server is running on http://localhost:3006");
});
