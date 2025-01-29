const mongoose  = require("mongoose");
const { string, required } = require("yargs");
const { default: Repository } = require("./repoModel");
const {Schema} = mongoose;


const IssueSchema = new Schema ({
    title:
    {
        type:String,
        required:true,
    },
    description:{
        type:String,
        required :true, 
    },
    status :
    {
        type:String,
        enu:["open","closed"],default:"open",

    }, 
    repository:{
        type:Schema.Types.ObjectId,
        ref:"Repository",
        required :true,
    },

});

const Issue = mongoose.model("Issue",IssueSchema);
export default Issue;