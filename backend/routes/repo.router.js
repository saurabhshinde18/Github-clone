const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepo);
repoRouter.get("/repo/all", repoController.getAllRepo);
repoRouter.get("/repo/:id", repoController.fetchRepoById);
repoRouter.get("/repo/name/:name", repoController.fetchRepoByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepoForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepo);
repoRouter.delete("/repo/delete/:id", repoController.deletedRepo);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibility);

module.exports = repoRouter;