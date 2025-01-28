process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addfile } = require("./controllers/add");
const { commit } = require("./controllers/commit");
const { push } = require("./controllers/push");
const { pull } = require("./controllers/pull");
const { revert } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new Server", {}, start)
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addfile(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commit(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, push)
  .command("pull", "Pull commits from S3", {}, pull)
  .command(
    "revert <commitId>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "ID of the commit to revert to",
        type: "string",
      });
    },
    (argv) => {
      revert(argv.commitId);
    }
  )
  .demandCommand(1, "You need to provide at least one command.")
  .help().argv;

function start() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.mongoURI;

  if (!mongoURI) {
    console.error("MongoDB URI is not set in environment variables.");
    process.exit(1);
  }

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("MongoDB connected successfully!");
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("Unable to connect to MongoDB:", err);
      process.exit(1);
    });
}
