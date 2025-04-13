import express from "express";
import { z } from "zod";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../db";

const router = express.Router();
const saltround = 5;
const JWT_SECRET = "hldfiyWENnds";

// Signup
router.post("/signup", async (req, res): Promise<any> => {
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
router.post("/signin", async (req, res): Promise<any> => {
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ token });
});

export default router;
