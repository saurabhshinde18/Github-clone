const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send("All Users Fetched");
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.signup = async (req, res) => {
  res.send("Signup successful");
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




