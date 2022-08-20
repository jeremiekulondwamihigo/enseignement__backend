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
    },
    codeEtablissement : {
        type:String, 
        required:true,
    },
    code_Annee : {
        type: String, 
        required: [true, "Please try year"]
    },
    code_Option : {
        type:String, 
        required:false //C'est recommander si le niveau de l'élève est inferieur à 5
    },
    niveau : {
        type : Number,
        required:true
    },
    resultat : {
        type:Number,
        required:true,
        default : 0
    },
    
})
const model = new mongoose.model("EleveInscrit", schema);
module.exports = model