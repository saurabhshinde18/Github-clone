const createRepository =(req,res)=>{
    res.send("Repository Created..!");
};



const getAllRepositories =(req,res)=>{
    res.send("All repositories fetched!!");
};



const fetchRepositoryById =(req,res)=>{
    res.send("Repository Details fetched!!");
};




const fetchRepositoryByName =(req,res)=>{
    res.send("Repository Details fetched!!");
};



const fetchRepositoriesForCurrentUser =(req,res)=>{
    res.send("Repositories for logged in user fetched!!");
};



const UpdateRepositoryById =(req,res)=>{
    res.send("Repository Updated!!");
};



const deleteRepositoryById =(req,res)=>{
    res.send("Repository Deleted!!");
};



const toggleVisibilityById =(req,res)=>{
    res.send("visibility toggled!!");
};


module.exports ={
    createRepository,
    getAllRepositories ,
    fetchRepositoryById,
    fetchRepositoryByName ,
    fetchRepositoriesForCurrentUser,
    UpdateRepositoryById ,
    deleteRepositoryById,
    toggleVisibilityById
}