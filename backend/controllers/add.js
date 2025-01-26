const fs = require ('fs').promises;
const path = require("path"); 

async function addfile(filePath){
    const repoPath  = path.resolve(process.cwd(),".gitbysaurabh");
    const stagingPath = path.join(repoPath ,"staging");
    try{
    await fs.mkdir(stagingPath,{recursive:true}) ;
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath,path.join(stagingPath,fileName));
    console.log(`File ${fileName} added to staging area !`);
    }catch(err){
        console.error("Error Adding file",err)
    }
}

module.exports = { addfile };