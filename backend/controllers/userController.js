require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGO_URI;


let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
  }
}

const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db("GithubClone"); // Updated database name
    const usersCollection = db.collection("users");

    // Check if the user already exists
    const user = await usersCollection.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertedId }, // Correct MongoDB ObjectId usage
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      userId: result.insertedId.toString(), // Ensure userId is a string
    });
  } catch (error) {
    console.error("Error during signup: ", error.message);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Connect to MongoDB directly
    const client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    const db = client.db("GithubClone");
    const usersCollection = db.collection("users");

    // Find user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare entered password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Send response with token and userId
    res.json({
      token,
      userId: user._id.toString(),
    });

    // Close the connection after the operation
    client.close();
  } catch (error) {
    console.error("Error during login: ", error); // Log detailed error information for debugging
    res.status(500).send("Server error");
  }
};

module.exports = { login };



const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("GithubClone");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error during fetching users: ", err.message);
    res.status(500).send("Server error!");
  }
};

const getUsersProfile = async (req, res) => {
  const currentID = req.params.id;
  try {
    await connectClient();
    const db = client.db("GithubClone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(currentID) });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.send(user);
  } catch (err) {
    console.error("Error during fetching profile: ", err.message);
    res.status(500).send("Server error!");
  }
};

const updateUserProfile = async (req, res) => {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("GithubClone");
    const usersCollection = db.collection("users");

    let updateFields = { email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(currentID) },
      { $set: updateFields }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(currentID) });
    res.json(updatedUser);
  } catch (err) {
    console.error("Error during updating profile: ", err.message);
    res.status(500).send("Server error!");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("GithubClone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deleteCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during deleting profile: ", err.message);
    res.status(500).send("Server error!");
  }
};

module.exports = {
  getAllUsers,
  signup,
  login, // Make sure login function is included in exports
  getUsersProfile,
  updateUserProfile,
  deleteUserProfile,
};
