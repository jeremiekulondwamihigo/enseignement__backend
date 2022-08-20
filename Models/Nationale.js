const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const schema = mongoose.Schema({
    id : {
        type:String,
        required:true,
        unique:true
    },
    code_agent : {
        type:String, 
        required:true, 
        unique:true
    },
    fonction : {
        type:String,
        required: true,
        unique:true,
        default: "nationale"
    },
})

const modules = new mongoose.model("Nationale", schema)
module.exports = modules