const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id : {
        type: String,
        required: [true, "Veuillez relancer l'enregistrement"],
        unique : true
    },
    code_eleve : {
        type:String, 
        required:[true, "Veuillez relancer l'enregistrement"],
        unique : true,
    },
    nom : {
        type : String,
        required: [true, "les nom est obligatoire"],
        unique:true
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
        required:[true, "Le genre est obligatoire"]
    },
    filename : {
        type:String,
        required:false,
        default:""
    }

})
schema.pre("save", async function(next){
    const name = this.nom;
    const nomsecond = name.toUpperCase();
    this.nom = nomsecond;

    next();
});


const model = new mongoose.model("Eleve", schema);
module.exports = model;