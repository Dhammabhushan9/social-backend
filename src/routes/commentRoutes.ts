import express from "express";
import { Middleware } from "../Middleware";
import { commentModel } from "../db";

const router = express.Router();

router.post("/:id", Middleware, async (req, res): Promise<any> => {
    //@ts-ignore
    // add userId in the request body
    const userId = req.userId;
    const postId= req.params.id;
    const   comment   = req.body;

    try {
        await commentModel.create({ userId, postId, comment });
        res.json({ message: "Comment added" });
    } catch (error) {
        res.status(400).json({ error });
    }
});
// not working // GET /api/comments/:postId
router.get("/:id", async (req, res) => {
    try {
      const comments = await commentModel.find({ postId: req.params.id })
        .populate("userId", "username")  
        .sort({ createdAt: -1 });  
  
      res.status(200).json(comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }); 
  

export default router;
