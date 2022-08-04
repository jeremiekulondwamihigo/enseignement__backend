const mongoose = require("mongoose")

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
    code_etablissement : {
        type:String, 
        required:true,
        minlength : 7,
    },
    code_Annee : {
        type: String, 
        required: [true, "Please try year"]
    },
    code_Option : {
        type:String, 
        required:true
    },
})
const model = new mongoose.model("EleveInscrit", schema);
module.exports = model