const mongoose = require("mongoose");

const valeur = mongoose.Schema({
    id : { 
        type: String, required: true, unique : true
    },
    cours : {
        type : String, required: true
    },
    code_domaine : {
        type : String, required: false, default : undefined
    },
    code_sous_domaine : {
        type: String, required: false, default : undefined
    },
    code_cours : {
        type:String, required:true, unique:true
    },
    maxima : {
        type:Number, required : true
    },
    niveau : {
        type: Number, required: true
    },
    code_Option : {
        type : String, required: false, default : undefined
    }
})

const model = new mongoose.model("Cours", valeur);
module.exports = model