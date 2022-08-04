const  mongoose = require("mongoose");

const schema = mongoose.Schema({
    code_sous_domaine : {
        type:String,
        required:true,
    },
    code_domaine : {
        type : String,
        required:true
    },
    titre_sous_domaine : {
        type : String,
        required: true
    }
});

const model = new mongoose.model("Sous_Domaine", schema);
module.exports = model;