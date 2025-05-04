import express from "express";
import { Middleware } from "../Middleware";
import { likeModel, postModel } from "../db";
import { error } from "console";

const router = express.Router();

router.get("/", Middleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const userId = req.userId;

    const posts = await postModel.find({ userId }).populate("userId", "username" );;
    return res.json(posts.length ? {   posts } : { message: "No posts found" });
});

router.post("/", Middleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const text = req.body.text;

    try {
        await postModel.create({ userId, text });
        res.json({ message: "Post is created" });
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.delete("/:postId", Middleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const userId = req.userId;
    const postId = req.params.postId;

    try {
        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await postModel.findByIdAndDelete(postId);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post", details: error });
    }
});

router.get("/like/:id",Middleware,async(req,res)=>{
    const postId= req.params.id;

    try{
        const postLike= await likeModel.find({
            postId
        })

        res.json({
            like:postLike,
            count:postLike.length
        })
    }catch(err){
        res.json({
            error:err
        })
    }
})


router.post("/like/:id", Middleware, async (req, res):Promise<any> => {
    const postId = req.params.id;
    // @ts-ignore
    const userId = req.userId;

    try {
        const isLiked = await likeModel.findOne({ userId, postId });

        if (!isLiked) {
            
            await likeModel.create({ userId, postId });
            return res.json({ message: "Liked the post" });
        } else {
           
            await likeModel.deleteOne({ userId, postId });
            return res.json({ message: "Unliked the post" });
        }
    } catch (err) {
        return res.status(500).json({ error:err});
    }
});


export default router;
