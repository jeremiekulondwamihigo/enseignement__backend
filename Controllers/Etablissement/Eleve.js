const Model_EleveInscrit = require("../../Models/EleveInscrit");
const Model_Eleve = require("../../Models/Eleves");
const Model_Annee = require("../../Models/Model_Annee")
const Model_Tuteur = require("../../Models/Tuteur")
const Model_Option = require("../../Models/Model_Option")

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
                        }).catch(function(error){return res.send(error)})
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
            const { niveau, codeEtablissement, codeInscription, code_Option } = req.body
            

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
                                    code_eleve : EleveFound.code_eleve, 
                                    codeEtablissement, 
                                    code_Annee : AnneeFound[0].code_Annee, 
                                    niveau : classe
                                }).then(EleveSeptiemeCreate =>{
                                    if(EleveSeptiemeCreate){
                                        return res.status(200).json({
                                            "message":"Elève enregistrer en 7eme année",
                                            "error":false
                                        })
                                    }
                                }).catch(function(error){return res.send(error)})
                            }
                            if(classe === 8){
                                Model_EleveInscrit.find({
                                    code_eleve : EleveFound.code_eleve,
                                    niveau : 7
                                }).then(EleveHuit =>{
                                    if(EleveHuit){
                                        Model_EleveInscrit.create({
                                            code_eleve : EleveFound.code_eleve, 
                                            codeEtablissement, 
                                            code_Annee : AnneeFound[0].code_Annee, 
                                            niveau : 8
                                        }).then(EleveHuitCreate =>{
                                            if(EleveHuitCreate){
                                                return res.status(200).json({
                                                    "message":"Elève enregistrer en 8eme année",
                                                    "error":false
                                                })
                                            }
                                        }).catch(function(error){return res.send(error)})
                                    }
                                })
                            }
                            else{
                                done(null, EleveFound, AnneeFound)
                            }
                        }else{
                            return res.status(200).json({"message":"Aucune année est activée", "error":true})
                        }
                    }).catch(function(error){return res.send(error)})
                },
                //Si l'élève n'est pas de la 7eme année
                function(EleveFound, AnneeFound, done){
                    if(classe === 1){
                        Model_EleveInscrit.findOne({
                            code_eleve : EleveFound.EleveFound,
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
                        code_eleve : EleveFound.EleveFound,
                    }).then(Eleve =>{
                        
                        if(Eleve){
                            const indice = Eleve[Eleve.length - 1];
                            const maxActuelle = Eleve[indice].max;
                           
                            if(indice + 1 !== classe){
                                return res.status(200).json({
                                    "message":`L'élève doit faire la ${Eleve[indice].niveau}eme`,
                                    "error":true
                                })
                            }
                            Model_Option.findOne({
                                code_Option
                            }).then(CodeFound =>{
                                if(CodeFound){
                                    if(CodeFound[0].max > maxActuelle){
                                        return res.status(200).json({
                                            "message":"Le resultat précédent doit etre superieur à "+CodeFound[0].max,
                                            "error":true
                                        })
                                    }else{
                                        done(null, EleveFound, AnneeFound)
                                    }
                                }
                            }).catch(function(error){return res.send(error)})
                        }
                    }).catch(function(error){return res.send(error)})
                },
                function(EleveFound, AnneeFound, done){
                    Model_EleveInscrit.create({
                        id, code_eleve : EleveFound.code_eleve , codeEtablissement,
                        code_Annee : AnneeFound.code_Annee, code_Option, niveau : classe,
                    }).then(EleveCreate =>{
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
    }
}