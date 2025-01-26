const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addfile } = require("./controllers/add");
const { commit } = require("./controllers/commit");
const { push }  =require("./controllers/push")
const { pull }  =require("./controllers/pull")
const {revert} = require("./controllers/revert");
yargs(hideBin(process.argv))
  .command(
    "init",
    "Initialize a new repository",
    {},
    initRepo
  )
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv)=>{
      addfile(argv.file)
    }
  )
  .command("commit  <message>","commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv)=>{
      commit(argv.message);
    }
  )
  .command("push", "push commits to s3",{},push)
  .command("pull","pull commits from s3",{},pull)
  .command("revert <commitId>","Revert to a specific commit",  (yargs) => {
    yargs.positional("message", {
      describe: "Commit message",
      type: "string",
    });
  },revert)
  .demandCommand(1, "You need to provide at least one command.")
  .help().argv;
