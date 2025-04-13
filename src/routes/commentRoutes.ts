import express from "express";
import { Middleware } from "../Middleware";
import { commentModel } from "../db";

const router = express.Router();

router.post("/", Middleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const userId = req.userId;
    const { postId, comment } = req.body;

    try {
        await commentModel.create({ userId, postId, comment });
        res.json({ message: "Comment added" });
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get("/", Middleware, async (req, res): Promise<any> => {
    const postId = req.body.postId;

    try {
        const comments = await commentModel.find({ postId }).populate("userId").sort({ createdAt: -1 });
        return res.json({ comments });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
