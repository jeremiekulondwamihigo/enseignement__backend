const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id : {
        type: String, 
        required: true,
        unique:true
    },
    etablissement : {
        type:String, 
        required:true,
    },
    code_proved : {
        type:String, 
        required:true,
    },
    code_agent : {
        type:String, 
        required:true,
    },
    codeEtablissement : {
        type:String, 
        required:true,
        minlength : 7,
        unique: true
    },
    active : {
        type:Boolean,
        required:true,
        default:true
    },
    
    code_option : {type:Array, required:false, default:[]},
    
})

const model = new mongoose.model("Etablissement", schema)
module.exports = model