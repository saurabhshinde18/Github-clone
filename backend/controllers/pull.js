const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pull() {
    const repoPath = path.resolve(process.cwd(), ".gitbysaurabh");
    const commitsPath = path.join(repoPath, "commits");

    try {
      
        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: "commits/",
        }).promise();

        const objects = data.Contents;

        if (!objects || objects.length === 0) {
            console.log("No commits found in S3.");
            return;
        }

        for (const object of objects) {
            const key = object.Key;
            const commitDir = path.join(commitsPath, path.dirname(key).split('/').pop());
           
            await fs.mkdir(commitDir, { recursive: true });

            const params = {
                Bucket: S3_BUCKET,
                Key: key,
            };

            try {
               
                const fileContent = await s3.getObject(params).promise();
                
                const localFilePath = path.join(repoPath, key);
                await fs.writeFile(localFilePath, fileContent.Body);
                console.log(`Pulled: ${key}`);
            } catch (err) {
                console.error(`Failed to fetch/write file for key: ${key}`, err);
            }
        }

        console.log("All commits pulled from S3.");
    } catch (err) {
        console.error("Unable to pull files:", err.message || err);
    }
}

module.exports = { pull };
