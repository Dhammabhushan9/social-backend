import express from "express";
import bcrypt, { hash } from "bcrypt";
import { makeIssue, promise, z } from "zod";
import jwt from "jsonwebtoken";

import { userModel, postModel, likeModel, commentModel,  } from "./db";
import { Middleware } from "./Middleware";

const app = express();
app.use(express.json());

const saltround = 5;
const JWT_SECRET = "hldfiyWENnds";

// ==============================
// 👤 User Routes
// ==============================

// Signup
app.post("/signup", async (req, res):Promise<any> => {
    console.log("✅ /signup called");
    const { username, password } = req.body;

    const userSchema = z.object({
        username: z.string(),
        password: z.string(),
    });

    const parsed = userSchema.safeParse({ username, password });

    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
    }

    try {
        const hashedPassword = await hash(password, saltround);
        await userModel.create({ username, password: hashedPassword });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error });
    }
});

// Signin
app.post("/signin", async (req, res):Promise<any> => {
    console.log("✅ /signin called");
    const { username, password } = req.body;

    const userSchema = z.object({
        username: z.string(),
        password: z.string(),
    });

    const parsed = userSchema.safeParse({ username, password });

    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
    }

    const user = await userModel.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    //@ts-ignore
    const isPasswordValid = await bcrypt.compare(password, user.password) ;
    if (!isPasswordValid) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ token });
});


/////___________________________________________________>
//serch user for follow

app.get("/search-users",Middleware,async(req,res):Promise<any>=>{
        const query = req.query.query;

         try{
            if(! query){
                res.status(400).json({message:"search query is needed"})
            }

            const users= await userModel.find({
                username:{$regex: query,$options: "i"  }
            });
            res.status(200).json(users);
         } catch (error) {
            console.error("User search error:", error);
            res.status(500).json({ message: "Internal Server Error" });
          }
})

// ==============================
// 📝 Post Routes
// ==============================

app.get("/post",Middleware,async(req,res):Promise<any>=>{
        //@ts-ignore
        const userId=req.userId;
        
        try{
            // fatch all the post of the user 
            const userPost=await postModel.find({
                userId:userId
            })
            if(userPost){
               return res.json({
                        post:userPost
                })
            }else{
                return res.json({
                    message:"not any post done by user"
                })
            }
        }
        catch(error){
            return res.json({
                error:error
            })
        }
})

app.post("/post",Middleware, async (req, res):Promise<any> => {
    console.log("✅ /post called");
    // @ts-ignore
    const userId = req.userId; 
    const text = req.body.text;

    try {
        await postModel.create({ userId, text });
        res.json({ message: "Post is created" });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.delete("/posts/:postId", Middleware, async (req, res):Promise<any> => {
    console.log("✅ DELETE /posts/:postId called");
    // @ts-ignore
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

// ==============================
// 💬 Comment Routes
// ==============================

app.post("/comment", Middleware, async (req, res) => {

    console.log("✅ /comment called");
    const postId = req.body.postId;
    // @ts-ignore
    const userId = req.userId;
    const comment = req.body.comment
    try {
        await commentModel.create({ userId, postId,comment });
        res.json({ message: "Comment added" });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// get all the comment on the post
app.get("/comment",Middleware,async(req,res):Promise<any>=>{
    const postId=req.body.postId;
    
    try{
        const comment= await commentModel.find({
                postId
        }).populate("userId").sort({ createdAt: -1 });    
        return res.json({
            comment
        })
    }catch(error){
        res.status(500).json({ message: "Internal Server Error" });
    }

})
// ==============================
// ❤️ Like Routes
// ==============================

app.post("/like", Middleware, async (req, res) => {
    console.log("✅ /like called");
    const postId = req.body.postId;
    // @ts-ignore
    const userId = req.userId;

    try {
        const isLike = await likeModel.findOne({ postId, userId });

        if (isLike) {
            await likeModel.deleteOne({ postId, userId });
            res.json({ message: "Unliked the post" });
        } else {
            await likeModel.create({ postId, userId });
            res.json({ message: "Liked the post" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

// ==============================
// 👥 Follow Routes
// ==============================

app.get("/follow",Middleware,async(req,res):Promise<any>=>{
    //@ts-ignore
    const userId=req.userId;
    
     

})
app.post("/follow", Middleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const userId = req.userId;                // user 1
    const followingId = req.body.followingId;  // user 2

    try {
        // Find user 1
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user 1 is already following user 2
        const isFollowing = user.following.includes(followingId);

        if (!isFollowing) {
            // User is not following, so follow the user
            await userModel.updateOne(
                { _id: userId },
                { $push: { following: followingId } }
            );

            // Add user 1 to user 2's followers array
            await userModel.updateOne(
                { _id: followingId },
                { $push: { followers: userId } }
            );

            return res.status(200).json({ message: "You are now following this user" });
        } else {
            // User is already following, so unfollow the user
            await userModel.findByIdAndUpdate(
                userId,
                { $pull: { following: followingId } }
            );

            // Remove user 1 from user 2's followers list
            await userModel.findByIdAndUpdate(
                followingId,
                { $pull: { followers: userId } }
            );

            return res.status(200).json({ message: "You have unfollowed this user" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
});

// ==============================
// 🟢 Start Server
// ==============================

app.listen(3006, () => {
    console.log("🚀 Server is running on http://localhost:3006");
});
