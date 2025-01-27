const fs = require("fs").promises;
const path = require("path");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1", 
  credentials: fromEnv(), 
});

const S3_BUCKET = process.env.S3_BUCKET || "gitbysaurabhbucket";

async function push() {
  const repoPath = path.resolve(process.cwd(), ".gitbysaurabh");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(commitPath, file);
          try {
            const fileContent = await fs.readFile(filePath); // Read file content

            const command = new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: `commits/${commitDir}/${file}`,
              Body: fileContent,
            });

            const response = await s3Client.send(command);
            console.log(`Uploaded: ${filePath} -> ${S3_BUCKET}/commits/${commitDir}/${file}`);
          } catch (fileError) {
            console.error(`Error processing file ${filePath}:`, fileError.message);
          }
        })
      );
    }

    console.log("All commits pushed to S3!");
  } catch (err) {
    console.error("Error pushing to S3:", err.message);
  }
}

module.exports = { push };
