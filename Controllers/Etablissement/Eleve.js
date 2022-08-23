const Model_EleveInscrit = require("../../Models/EleveInscrit");
const Model_Eleve = require("../../Models/Eleves");
const Model_Annee = require("../../Models/Model_Annee")
const Model_Tuteur = require("../../Models/Tuteur")
const Model_Option = require("../../Models/Model_Option")

const asyncLab = require("async");
const { isEmpty, generateNumber } = require("../../Fonctions/Static_Function")

const exportation = (code)=>{
    Model_Eleve.findOneAndUpdate({code_eleve : code}, { $set : { libre : false}}, null, (error, result)=>{
        if(error)throw error
        if(result){
           return result 
        }
        
    })
}

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
                        }).catch(function(error){return res.send(error)})
                    }else{
                        done(null, anneeFound)
                    }
                },
                function(annee, done){

                    const code = `${annee.annee.split("-")[1]}-${generateNumber(5)}`

                    Model_Eleve.create({
                        id, code_eleve : code.trim(), nom, genre, codeTuteur : code_tuteur, date_Naissance,lieu_naissance,
                        codeEtablissement : agentSave, codeInscription : code.trim() 
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
    ReInscription : (req, res)=>{
        try {
            const { niveau, codeEtablissement, codeInscription, code_Option, id } = req.body
            

            if(isEmpty(niveau) || isEmpty(codeInscription) || isEmpty(codeEtablissement)){
                return res.status(200).json({
                    "message":"Veuillez remplir les champs",
                    "error":true
                })
            }
            
            const classe = parseInt(niveau);
            const code = codeInscription.trim()

            if(classe < 5 && isEmpty(code_Option)){
                return res.status(200).json({
                    "message":"L'option est indéfinie",
                    "error":true
                })
            }
            
            asyncLab.waterfall([
                function(done){
                    Model_Eleve.findOne({
                        codeInscription : code, libre : true
                    }).then(EleveFound =>{
                        
                        if(EleveFound){
                            done(null, EleveFound)
                        }else{
                            return res.status(200).json({
                                "message":"Inscription non autoriser",
                                "error":true
                            })
                        }
                    }).catch(function(error){return res.send(error)})
                },
                function(EleveFound, done){
                    Model_Annee.findOne({active : true}).then(AnneeFound =>{
                        if(AnneeFound){
                            if(classe === 7){
                                Model_EleveInscrit.create({
                                    id,
                                    code_eleve : EleveFound.code_eleve, 
                                    codeEtablissement, 
                                    code_Annee : AnneeFound.code_Annee, 
                                    niveau : classe
                                }).then(EleveSeptiemeCreate =>{
                                    
                                    if(EleveSeptiemeCreate){
                                        exportation(EleveSeptiemeCreate.code_eleve);
                                        done(true);
                                        
                                    }else{done(false)}
                                }).catch(function(error){return res.send(error)})
                            }
                            
                            else{
                                done(null, EleveFound, AnneeFound)
                            }
                        }else{
                            return res.status(200).json({"message":"Aucune année est activée", "error":true})
                        }
                    }).catch(function(error){return res.send(error)})
                },
                function(EleveFound, AnneeFound, done){
                    if(classe === 8){
                        Model_EleveInscrit.find({
                            code_eleve : EleveFound.code_eleve,
                            niveau : 7
                        }).then(EleveHuit =>{
                            if(EleveHuit){
                                Model_EleveInscrit.create({
                                    code_eleve : EleveFound.code_eleve, 
                                    codeEtablissement, 
                                    code_Annee : AnneeFound.code_Annee, 
                                    niveau : 8, id
                                }).then(EleveHuitCreate =>{
                                    if(EleveHuitCreate){
                                        exportation(EleveFound.code_eleve);
                                        return res.status(200).json({
                                            "message":"Elève enregistrer en 8eme année",
                                            "error":false
                                        })
                                        
                                    }
                                }).catch(function(error){return res.send(error)})
                            }
                        })
                    }else{
                        done(null, EleveFound, AnneeFound)
                    }
                },
                //Si l'élève n'est pas de la 7eme année
                function(EleveFound, AnneeFound, done){
                    if(classe === 1){
                        Model_EleveInscrit.findOne({
                            code_eleve : EleveFound.code_eleve,
                            niveau : 8
                        }).then(EleveHuitiemeFound =>{
                            if(EleveHuitiemeFound){
                                Model_EleveInscrit.create({
                                    id, code_eleve : EleveFound.code_eleve, 
                                    codeEtablissement, 
                                    code_Annee : AnneeFound.code_Annee,
                                    code_Option,
                                    niveau : 1,
                                }).then(ElevePremiereCreate =>{
                                    if(ElevePremiereCreate){
                                        exportation(EleveFound.code_eleve);
                                        return res.status(200).json({
                                            "message":"Elève enregistrer en premiere annee",
                                            "error":false
                                        })
                                    }else{
                                        return res.status(200).json({
                                            "message":"Erreur d'enregistrement",
                                            "error":true
                                        })
                                    }
                                }).catch(function(error){ return res.send(error)})

                            }else{
                                return res.status(200).json({
                                    "message": "L'élève n'est pas inscrit en huitieme CTB",
                                    "error":true
                                })
                            }
                        })
                    }else{
                        done(null, EleveFound, AnneeFound)
                    }
                },
                //Si la classe est 2, 3 et 4 ?
                function(EleveFound, AnneeFound, done){
                    Model_EleveInscrit.find({
                        code_eleve : EleveFound.code_eleve,
                    }).then(Eleve =>{
                        
                        if(Eleve){
                            const indice = Eleve[Eleve.length - 1];
                           
                            if(parseInt(indice.niveau) + 1 != classe){
                                return res.status(200).json({
                                    "message":`L'élève doit faire le niveau ${parseInt(indice.niveau) + 1}`,
                                    "error":true
                                })
                            }else{
                                
                                Model_Option.findOne({
                                    code_Option
                                }).then(CodeFound =>{
                                    console.log("e suis eleve", Eleve[Eleve.length - 1])
                                    if(CodeFound){
                                        if(CodeFound.max > Eleve[Eleve.length - 1].resultat){
                                            return res.status(200).json({
                                                "message":"Le resultat précédent doit etre superieur à "+CodeFound.max+"%",
                                                "error":true
                                            })
                                        }else{
                                            done(null, EleveFound, AnneeFound)
                                        }
                                    }
                                }).catch(function(error){return res.send(error)})
                            }
                           
                        }else{
                            return res.status(200).json({
                                "message":"Eleve introuvable",
                                "error":true
                            })
                        }
                    }).catch(function(error){return res.send(error)})
                },
                function(EleveFound, AnneeFound, done){
                    Model_EleveInscrit.create({
                        id, code_eleve : EleveFound.code_eleve , codeEtablissement,
                        code_Annee : AnneeFound.code_Annee, code_Option, niveau : classe,
                    }).then(EleveCreate =>{
                        exportation(EleveFound.code_eleve);
                        done(EleveCreate)
                    }).catch(function(error){ return res.send(error)})
                }
            ], function(EleveCreate){
                if(EleveCreate){
                    return res.status(200).json({
                        "message":"Enregistrement effectué",
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
    ReadEleveEtablissement : async(req, res)=>{
        const { codeEtablissement } = req.params
        Model_Eleve.find({
            codeEtablissement
        }).then(eleveFound =>{
            return res.send(eleveFound.reverse())
        }).catch(function(error){console.log(error)})
    },
    EleveReadSelonAnnee : (req, res)=>{
        const { annee } = req.params

        let lookEleve = {
            $lookup : {
                from : "eleves",
                localField : "code_eleve",
                foreignField : "code_eleve",
                as : "eleve"
            }
        }
        let option = {
            $lookup : {
                from : "options",
                localField : "code_Option",
                foreignField : "code_Option",
                as : "option"
            }
        }
        let match = { $match : {code_Annee : annee }}
        Model_EleveInscrit.aggregate([match, lookEleve, option]).then(EleveFound =>{
            return res.status(200).json(EleveFound.reverse());
        }).catch(function(error){return res.send(error)})
    }

}