const mongoose = require("mongoose")

const Secteur = mongoose.Schema({
    code_province : { type:String, required:true }, //Ici c'est pour toute les fonctions
    code_agent : { type:String, required:true }, //Agent titulaire
    denomination : { type:String, required:true, unique : true }, // Dénomination de l'entité 
    code_proved : { type : String, required: true, unique : true }, // Si c'est un proved ce champs est obligatoire
    id : { type : String, required: true, unique : true },
    code_annee : { type : String, required: false, default:"" },
})

  const model = new mongoose.model("Division", Secteur)
  module.exports = model