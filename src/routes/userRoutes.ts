import express from "express";
import { Middleware } from "../Middleware";
import { userModel } from "../db";

const router = express.Router();

// Search users
router.get("/search-users", Middleware, async (req, res): Promise<any>=> {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ message: "Search query is needed" });
    }

    try {
        const users = await userModel.find({ username: { $regex: query, $options: "i" } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Follow/unfollow
router.post("/follow", Middleware, async (req, res):Promise<any> => {
    //@ts-ignore
    const userId = req.userId;
    const followingId = req.body.followingId;

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isFollowing = user.following.includes(followingId);
        if (!isFollowing) {
            await userModel.updateOne({ _id: userId }, { $push: { following: followingId } });
            await userModel.updateOne({ _id: followingId }, { $push: { follower: userId } });
            return res.status(200).json({ message: "Now following user" });
        } else {
            await userModel.updateOne({ _id: userId }, { $pull: { following: followingId } });
            await userModel.updateOne({ _id: followingId }, { $pull: { follower: userId } });
            return res.status(200).json({ message: "Unfollowed user" });
        }
    } catch (error) {
        //@ts-ignore
        return res.status(500).json({ message: "Error occurred", error: error.message });
    }
});

export default router;
