const mongoose = require("mongoose")

const schema = mongoose.Schema({
    code_province : {
        type:String,
        required:true
    },
    code_division : {
        type:String,
        required:true,
        unique:true
    },
    denomination : {
        type:String,
        required:true,
        unique:true
    },
    code_agent : {
        type:String,
        required:true,
        unique:true
    },
    id : {
        type:String, required: true, unique : true
    },
    active : {
        type:Boolean,
        required:true,
        default:true
    }
});
const model = new mongoose.model("Division", schema);
module.exports = model;