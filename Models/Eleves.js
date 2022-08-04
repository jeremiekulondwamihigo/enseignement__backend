const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id : {
        type: String,
        required:true,
        unique : true
    },
    code_eleve : {
        type:String, 
        required:true,
        unique : true,
    },
    nom : {
        type : String,
        required:true,
    },
    code_tuteur : {
        type:String,
        required:false,
        default:""
    },
    date_Naissance : {
        type:String,
        required:false,
        default:""
    },
    lieu_naissance : {
        type:String,
        required:false,
        default:""
    },
    genre : { 
        type:String, 
        required:true
    },
    filename : {
        type:String,
        required:false,
        default:""
    }

})

const model = new mongoose.model("Eleve", schema);
module.exports = model;