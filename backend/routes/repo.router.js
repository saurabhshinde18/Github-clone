const express = require("express");
const repoController  = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/sll", repoController. getAllRepositories);
repoRouter.get("/repo/fetch/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/fetch/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/:userId", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:Id", repoController.UpdateRepositoryById);
repoRouter.delete("/repo/delete/:Id", repoController.deleteRepositoryById );
repoRouter.patch("/repo/toggle/:Id", repoController.toggleVisibilityById);



module.exports = repoRouter;
