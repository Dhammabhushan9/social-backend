import mongoose from "mongoose";
import { ref } from "process";
const { Schema } = mongoose;

// MongoDB connection
try {
  mongoose.connect("mongodb+srv://cob56dhammabhushanwaghmare:omtNTxv1bOtWqTmD@cluster0.jtu0y.mongodb.net/social");
  console.log("MongoDB connected");
} catch (error) {
  console.log("Connection error:", error);
}

// User Schema
const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  follower:[{
    type:mongoose.Types.ObjectId,
    ref:"User"
  }],
  following:[{
    type:mongoose.Types.ObjectId,
    ref:'User'
  }]
}, { timestamps: true });

// Post Schema
const Post = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Like Schema
const Like = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, { timestamps: true });

// Comment Schema
const Comment = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  postId: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });
 

 

// Exporting models
export const userModel = mongoose.model("User", User);
export const postModel = mongoose.model("Post", Post);
export const likeModel = mongoose.model("Like", Like);
export const commentModel = mongoose.model("Comment", Comment);
 