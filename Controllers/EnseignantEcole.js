const EnseignantEcole = require("../Models/Enseignant_ecole");
const { isEmpty } = require("../Fonctions/Static_Function");
const Model_Agent = require("../Models/Model_Agent")
const asyncLab = require("async")

module.exports = {

    Save_Enseignant : (req, res)=>{
        try {
            const { code_etablissement, code_agent, id } = req.body
            if(isEmpty(code_etablissement) || isEmpty(code_agent) || isEmpty(id)){
                return res.status(200).json({
                    "message":"Veuillez renseigner les champs",
                    "error":true
                })
            }

            asyncLab.waterfall([
                function(done){
                    Model_Agent.findOne({
                        code_agent
                    }).then(agentFound =>{
                        if(agentFound){
                            done(null, agentFound)
                        }else{
                            return res.status(200).json({
                                "message":"Agent introuvable",
                                "error":true

                            })
                        }
                    })
                }, 
                function(agentFound, done){
                    EnseignantEcole.findOne({
                        code_agent, code_etablissement
                    }).then(etablissementAgentFound =>{
                        if(etablissementAgentFound){
                            return res.status(200).json({
                                "message":"L'agent existe déjà",
                                "error":true
                            })
                        }else{
                            done(null, agentFound)
                        }
                    })
                },
                function(agentFound, done){
                    EnseignantEcole.create({ code_agent, code_etablissement, id})
                    .then(agentSave=>{
                        if(agentSave){
                            done(null, agentFound)
                        }else{
                            done(false)
                        }
                    })
                },
                function(agentFound, done){
                    //Envoyer Message " Bonjour Agent vous êtes engagé au CS SEBYERA
                    done(agentFound)
                }
            ], function(result){
                if(result){
                    return res.status(200).json({
                        "message":"Opération effectuée",
                        "error":false
                    })
                }else{
                    return res.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":true
                    })
                }
            })



        } catch (error) {
            console.log(error)
        }
    }
}