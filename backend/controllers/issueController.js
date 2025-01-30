const createIssue = (req,res)=>{
    res.send("Issue Created...!");
};

const updateIssueById= (req,res)=>{
    res.send("Issue Updated...!");
};


const deleteIssueById = (req,res)=>{
    res.send("Issue Deleted..!");
};

const getAllIssues = (req,res)=>{
    res.send(" All Issue Fetched...!");
};


const getIssueById= (req,res)=>{
    res.send("Issue Fetched...!");
};


module.exports = {
    createIssue,updateIssueById,deleteIssueById,getAllIssues,getIssueById
}



