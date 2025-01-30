const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/signUp", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile", userController.getUserProfile);
userRouter.put("/updateProfile", userController.updateUserProfile);
userRouter.delete("/deleteprofile", userController.deleteUserProfile);

module.exports = userRouter;
