const Model_Eleve = require("../Models/EleveInscrit");
const Model_EleveInscrit = require("../Models/Eleves");
const Model_Annee = require("../Models/Model_Annee")

const asyncLab = require("async");
const { isEmpty, generateNumber } = require("../Fonctions/Static_Function")

module.exports = {
    Add_Eleve : async (req, res)=>{
        try {

            const { id, code_eleve, code_tuteur, nom, date_Naissance, lieu_naissance, genre, filename } = req.body

            if(isEmpty(nom) || isEmpty(id) || isEmpty(genre)){
                return res.status(200).json({
                    "message":"Veuillez renseigner les champs",
                    "error":true
                })
            }
            

            await asyncLab.waterfall([
                function(done){
                    Model_Annee.findOne({ active : true }).then(anneeFound =>{
                        if(anneeFound){
                            done(null, anneeFound)
                        }
                    }).catch(error =>{
                        return res.send(error)
                    })
                },
                function(annee, done){

                    const code = `${annee.annee.split("-")[1]}-${generateNumber(5)}`

                    Model_EleveInscrit.create({
                        id, code_eleve : code, nom, genre, code_tuteur, date_Naissance,lieu_naissance, filename
                    }).then(response =>{

                        done(response)
                    
                    })
                    .catch(error =>{
                        done(false)
                        return res.send(error)
                    })
                }
            ], function(response){
                if(response){
                    return res.status(200).json(response)
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
    }
}