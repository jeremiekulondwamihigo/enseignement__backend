const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id : {
        type:String,
        required:true,
        unique:true
    },
    code_etablissement : {
        type: String,
        required:true
    },
    code_agent : {
        type:String, 
        required:true
    },
})
const model = new mongoose.model("EnseignantEcole", schema);
module.exports = model