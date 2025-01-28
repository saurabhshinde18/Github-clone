const fs = require('fs').promises;
const path = require('path');

async function revert(commitID) {
    const repoPath = path.resolve(process.cwd(), ".gitbysaurabh");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitsPath, commitID);

        const metadataPath = path.join(commitDir, "commit.json");
        const commitExists = await fs.access(metadataPath).then(() => true).catch(() => false);
        if (!commitExists) {
            console.error(`Commit metadata not found for ID: ${commitID}`);
            return;
        }

        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        console.log(`Reverting commit ${commitID} with message: "${metadata.message}"`);

        const files = await fs.readdir(commitDir);
        const parentDir = path.resolve(repoPath, "..");

        for (const file of files) {
            if (file !== "commit.json") {
                const sourcePath = path.join(commitDir, file);
                const destinationPath = path.join(parentDir, file);

                try {
                    await fs.copyFile(sourcePath, destinationPath);
                    console.log(`Reverted file: ${file}`);
                } catch (err) {
                    console.error(`Failed to revert file: ${file}`, err);
                }
            }
        }

        console.log(`Commit ${commitID} reverted successfully!`);
    } catch (error) {
        console.error(`Unable to revert commit ${commitID}:`, error);
    }
}

module.exports = { revert };
