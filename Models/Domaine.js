const mongoose = require("mongoose");

const valeur = mongoose.Schema({
    id : { 
        type: String,
        required: true, 
    },
    domaine : {
        type : String, 
        required: [true, "This field is required"],
        
    },
    classe : {
        type : Number, 
        required: [true, "This field is required"],
    },
    code_Option : {
        type:String,
        required: false
    },
    code_domaine : {
        type : String, 
        required: false,
        default : ""
    }
})

const model = new mongoose.model("Domaine", valeur);
module.exports = model