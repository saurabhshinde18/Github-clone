const express = require("express");
const repoController  = require("../controllers/issueController");

const issueRouter = express.Router();

issueRouter.post("/issue/create", repoController.createIssue);
issueRouter.put("/issue/update/:id", repoController.updateIssueById);
issueRouter.delete("/issue/delete/:id", repoController.deleteIssueById);
issueRouter.get("/issue/all", repoController.getAllIssues);
issueRouter.get("/issue/:id", repoController.getIssueById);



module.exports = issueRouter;
