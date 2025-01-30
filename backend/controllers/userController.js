const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const Repository = require("../models/repoModel");

require('dotenv').config();

const uri = process.env.MONGO_URI;

console.log("MongoDB URI:", uri);  

let client;

async function connectClient() {
    if (!client) {
        try {
            if (!uri) {
                throw new Error("MongoDB URI is missing or invalid.");
            }
            client = new MongoClient(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            await client.connect();
            console.log("MongoDB connected successfully!");
        } catch (err) {
            console.error("MongoDB connection failed:", err.message);
            throw new Error("Database connection failed.");
        }
    }
}

exports.signup = async (req, res) => {
    console.log("Request Body:", req.body);

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        await connectClient();
        const db = client.db("GithubClone");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User Already Exists.." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: []
        };

        const result = await userCollection.insertOne(newUser);
        if (!result.insertedId) {
            throw new Error("Failed to insert user.");
        }

        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (err) {
        console.error("Error During Signup:", err.message);
        res.status(500).send("Server Error");
    }
};

exports.login = async (req, res) => {
    res.send("Login successful");
};

exports.getUserProfile = async (req, res) => {
    res.send("User profile data");
};

exports.updateUserProfile = async (req, res) => {
    res.send("User profile updated");
};

exports.deleteUserProfile = async (req, res) => {
    res.send("User profile deleted");
};
