const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id : {
        type: String,
        required: true,
        unique : true
        //Valeur front automatiquement
    },
    code_eleve : {
        type:String, 
        required:true,
        unique : true,
        //Valeur backend
    },
    nom : {
        type : String,
        required: true,
    },
    postNom : {
        type : String,
        required: true,
    },
    prenom : {
        type : String,
        required: true,
    },
    codeTuteur : {
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
    },
    libre : {
        type:Boolean,
        required:true,
        default:true 
        //Quand il sera enregistrer dans une établissement cette valeur prendra la valeur false
    },
    codeEtablissement : {
        type : String,
        required:true
    },//Code de l'établissement effectuant l'enregistrement
    codeInscription : {
        type:String,
        required:true,
        //Ce code est générer automatiquement pour chaque cloture de l'année, Ce code permettra d'inscrire l'élève
    },
    nationalite : {
        type:String,
        required:true
    },
    nomPere : {
        type:String,
        required:false,
        default: ""
    },
    professionPere :{
        type:String,
        required:false,
        default : ""
    },
    nomMere : {
        type:String, 
        required:false,
        default:""
    },
    professionMere : {
        type:String,
        required:false,
        default:""
    },

})
schema.pre("save", async function(next){
    const name = this.nom;
    const nomsecond = name.toUpperCase().trim();
    this.nom = nomsecond;

    next();
});


const model = new mongoose.model("Eleve", schema);
module.exports = model;