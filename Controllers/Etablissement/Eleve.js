const Model_EleveInscrit = require("../../Models/EleveInscrit");
const Model_Eleve = require("../../Models/Eleves");
const Model_Annee = require("../../Models/Model_Annee")
const Model_Tuteur = require("../../Models/Tuteur")

const asyncLab = require("async");
const { isEmpty, generateNumber } = require("../../Fonctions/Static_Function")

module.exports = {
    PremiereEnregistrement : async (req, res)=>{
        try {

            const { id, code_tuteur, agentSave, nom, date_Naissance, lieu_naissance, genre } = req.body

            if(isEmpty(nom) || isEmpty(id) || isEmpty(genre) || isEmpty(agentSave)){
                return res.status(200).json({
                    "message":"Veuillez renseigner les champs",
                    "error":true
                })
            }

            asyncLab.waterfall([
                function(done){
                    Model_Annee.findOne({ active : true }).then(anneeFound =>{
                        if(anneeFound){
                            done(null, anneeFound)
                        }
                    }).catch(error =>{
                        return res.send(error)
                    })
                },
                function(anneeFound, done){
                    if(!isEmpty(code_tuteur)){
                        Model_Tuteur.findOne({
                            codeTuteur : code_tuteur
                        }).then(tuteur =>{
                            if(tuteur){
                                done(null, true)
                            }else{
                                return res.status(200).json({
                                    "message":"Tuteur introuvable",
                                    "error":true
                                })
                            }
                        })
                    }else{
                        done(null, anneeFound)
                    }
                },
                function(annee, done){

                    const code = `${annee.annee.split("-")[1]}-${generateNumber(5)}`

                    Model_Eleve.create({
                        id, code_eleve : code, nom, genre, codeTuteur : code_tuteur, date_Naissance,lieu_naissance,
                        codeEtablissement : agentSave, codeInscription : code 
                    }).then(response =>{
                        if(response){
                            done(response)
                        }else{done(false)}
                    })
                    .catch(error =>{
                        console.log(error)
                    })
                }
            ], function(response){
                if(response){
                    return res.status(200).json({
                        "message":"Enregistrement effectuer",
                        "error":false
                    })
                }else{
                    return res.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":false
                    })
                }
            })
            
        } catch (error) {
            console.log(error)
        }
    },
    ReInscription : async(req, res)=>{
        try {
            
        } catch (error) {
            console.log(error)
        }
    },
    ReadEleveEtablissement : async(req, res)=>{
        const { codeEtablissement } = req.params
        Model_Eleve.find({
            codeEtablissement
        }).then(eleveFound =>{
            return res.send(eleveFound.reverse())
        }).catch(function(error){console.log(error)})
    }
}