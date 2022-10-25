const Model_EleveInscrit = require("../../Models/EleveInscrit");
const Model_Eleve = require("../../Models/Eleves");
const Model_Annee = require("../../Models/Model_Annee")
const Model_Tuteur = require("../../Models/Tuteur")
const Model_Option = require("../../Models/Model_Option")
const Model_Etablissement = require("../../Models/Model_Etablissement")
const Model_Division = require("../../Models/Division")

const asyncLab = require("async");
const {isEmpty, generateNumber, convert} = require("../../Fonctions/Static_Function");

const exportation = (code) => {
    Model_Eleve.findOneAndUpdate({
        code_eleve: code
    }, {
        $set: {
            libre: false
        }
    }, null, (error, result) => {
        if (error) 
            throw error


        


        if (result) {
            return result
        }

    })
}


module.exports = {


    PremiereEnregistrement: async (req, res) => {
        try {


            const {
                id,
                code_tuteur,
                agentSave,
                nom,
                postNom,
                prenom,
                nationalite,
                nomPere,
                professionPere,
                nomMere,
                professionMere,
                date_Naissance,
                lieu_naissance,
                genre
            } = req.body

            if (isEmpty(nom) || isEmpty(id) || isEmpty(postNom) || isEmpty(genre) || isEmpty(agentSave) || isEmpty(prenom) || isEmpty(lieu_naissance) || isEmpty(date_Naissance)) {
                return res.status(200).json({"message": "Le champs ayant l'asteriste est obligatoire", "error": true})
            }

            asyncLab.waterfall([
                function (done) {
                    Model_Annee.findOne({active: true}).then(anneeFound => {
                        if (anneeFound) {
                            done(null, anneeFound)
                        }
                    }).catch(error => {
                        return res.send(error)
                    })
                },
                function (anneeFound, done) {
                    if (!isEmpty(code_tuteur)) {
                        Model_Tuteur.findOne({codeTuteur: code_tuteur}).then(tuteur => {
                            if (tuteur) {
                                done(null, true)
                            } else {
                                return res.status(200).json({"message": "Tuteur introuvable", "error": true})
                            }
                        }).catch(function (error) {
                            return res.send(error)
                        })
                    } else {
                        done(null, anneeFound)
                    }
                },
                function (annee, done) {

                    const code = `${
                        annee.annee.split("-")[1]
                    }-${
                        generateNumber(5)
                    }`

                    Model_Eleve.create({
                        id,
                        code_eleve: code.trim(),
                        nom: convert(nom),
                        postNom: convert(postNom),
                        prenom: convert(prenom),
                        nationalite: convert(nationalite),
                        nomPere: convert(nomPere),
                        professionPere: convert(professionPere),
                        nomMere: convert(nomMere),
                        professionMere: convert(professionMere),
                        genre,
                        codeTuteur: code_tuteur,
                        date_Naissance,
                        lieu_naissance: convert(lieu_naissance),
                        codeEtablissement: agentSave,
                        codeInscription: code.trim()
                    }).then(response => {

                        if (response) {

                            done(response)
                        } else {
                            done(false)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                }
            ], function (response) {
                if (response) {
                    return res.status(200).json({
                            "message": `Eleve ${
                            convert(nom)
                        } ${
                            convert(postNom)
                        } ${
                            convert(prenom)
                        }, code : ${
                            response.code_eleve
                        }`,
                        "error": false
                    })
                } else {
                    return res.status(200).json({"message": "Erreur d'enregistrement", "error": false})
                }
            })

        } catch (error) {
            console.log(error)
        }
    },
    ReInscription: (req, res) => {
        try {
            const {
                niveau,
                codeEtablissement,
                codeInscription,
                code_Option,
                id,
                annee
            } = req.body

            if (isEmpty(niveau) || isEmpty(codeInscription) || isEmpty(codeEtablissement)) {
                return res.status(200).json({"message": "Veuillez remplir les champs", "error": true})
            }

            const classe = parseInt(niveau);
            const code = codeInscription.trim()

            if (classe < 5 && isEmpty(code_Option)) {
                return res.status(200).json({"message": "L'option est indéfinie", "error": true})
            }

            asyncLab.waterfall([
                function (done) {

                    Model_Eleve.findOne({codeInscription: code, libre: true}).then(EleveFound => {

                        if (EleveFound) {
                            done(null, EleveFound)
                        } else {
                            return res.status(200).json({"message": "Inscription non autoriser", "error": true})
                        }


                    }).catch(function (error) {
                        return res.send(error)
                    })
                },

                function (EleveFound, done) {

                    Model_Annee.findOne({active: true}).then(AnneeFound => {
                        if (!AnneeFound) {
                            return res.status(200).json({"message": "Année non reconnue", "error": true})
                        } else {
                            done(null, EleveFound, AnneeFound)
                        }
                    }).catch(function (error) {
                        return res.send(error)
                    })
                },
                function (EleveFound, AnneeFound, done) {

                    Model_EleveInscrit.findOne({"code_Annee": AnneeFound.code_Annee, "codeEtablissement": codeEtablissement, "code_eleve": EleveFound.code_eleve}).then(eleveFounds => {
                        if (eleveFounds) {
                            return res.status(200).json({"message": "L'élève est enregistré", "error": true})
                        } else {
                            done(null, EleveFound, AnneeFound)
                        }
                    })
                },
                function (EleveFound, AnneeFound, done) {

                    if (classe === 7) {
                        Model_EleveInscrit.create({
                            id,
                            code_eleve: EleveFound.code_eleve,
                            codeEtablissement,
                            code_Annee: AnneeFound.code_Annee,
                            niveau: classe,
                            codeInscription
                        }).then(EleveSeptiemeCreate => {
                            if (EleveSeptiemeCreate) {
                                exportation(EleveSeptiemeCreate.code_eleve);
                                return res.status(200).json({"message": "Inscription effectuée", "error": false})

                            } else {
                                done(false)
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                    } else {
                        done(null, EleveFound, AnneeFound)
                    }

                },
                function (EleveFound, AnneeFound, done) {
                    if (classe === 8) {
                        Model_EleveInscrit.find({code_eleve: EleveFound.code_eleve, niveau: 7}).then(EleveHuit => {
                            if (EleveHuit) {
                                Model_EleveInscrit.create({
                                    code_eleve: EleveFound.code_eleve,
                                    codeEtablissement,
                                    code_Annee: AnneeFound.code_Annee,
                                    niveau: 8,
                                    id,
                                    codeInscription
                                }).then(EleveHuitCreate => {
                                    if (EleveHuitCreate) {
                                        exportation(EleveFound.code_eleve);
                                        return res.status(200).json({"message": "Elève enregistrer en 8eme année", "error": false})

                                    }
                                }).catch(function (error) {
                                    return res.send(error)
                                })
                            }
                        })
                    } else {
                        done(null, EleveFound, AnneeFound)
                    }
                },
                // Si l'élève n'est pas de la 7eme année
                function (EleveFound, AnneeFound, done) {
                    if (classe === 1) {
                        Model_EleveInscrit.findOne({code_eleve: EleveFound.code_eleve, niveau: 8}).then(EleveHuitiemeFound => {
                            if (EleveHuitiemeFound) {
                                Model_EleveInscrit.create({
                                    id,
                                    code_eleve: EleveFound.code_eleve,
                                    codeEtablissement,
                                    code_Annee: AnneeFound.code_Annee,
                                    code_Option,
                                    niveau: 1,
                                    codeInscription
                                }).then(ElevePremiereCreate => {
                                    if (ElevePremiereCreate) {
                                        exportation(EleveFound.code_eleve);
                                        return res.status(200).json({"message": "Elève enregistrer en premiere annee", "error": false})
                                    } else {
                                        return res.status(200).json({"message": "Erreur d'enregistrement", "error": true})
                                    }
                                }).catch(function (error) {
                                    return res.send(error)
                                })

                            } else {
                                return res.status(200).json({"message": "L'élève n'est pas inscrit en huitieme CTB", "error": true})
                            }
                        })
                    } else {
                        done(null, EleveFound, AnneeFound)
                    }
                },
                // Si la classe est 2, 3 et 4 ?
                function (EleveFound, AnneeFound, done) {
                    Model_EleveInscrit.find({code_eleve: EleveFound.code_eleve}).then(Eleve => {

                        if (Eleve) {
                            const indice = Eleve[Eleve.length - 1];

                            if (parseInt(indice.niveau) + 1 != classe) {
                                return res.status(200).json({
                                        "message": `L'élève doit faire le niveau ${
                                        parseInt(indice.niveau) + 1
                                    }`,
                                    "error": true
                                })
                            } else {

                                Model_Option.findOne({code_Option}).then(CodeFound => {
                                    if (CodeFound) {
                                        if (CodeFound.max > Eleve[Eleve.length - 1].resultat) {
                                            return res.status(200).json({
                                                "message": "Le resultat précédent doit etre superieur à " + CodeFound.max + "%",
                                                "error": true
                                            })
                                        } else {
                                            done(null, EleveFound, AnneeFound)
                                        }
                                    }
                                }).catch(function (error) {
                                    return res.send(error)
                                })
                            }

                        } else {
                            return res.status(200).json({"message": "Eleve introuvable", "error": true})
                        }
                    }).catch(function (error) {
                        return res.send(error)
                    })
                },
                function (EleveFound, AnneeFound, done) {
                    Model_EleveInscrit.create({
                        id,
                        code_eleve: EleveFound.code_eleve,
                        codeEtablissement,
                        code_Annee: AnneeFound.code_Annee,
                        code_Option,
                        niveau: classe,
                        codeInscription
                    }).then(EleveCreate => {
                        exportation(EleveFound.code_eleve);
                        done(EleveCreate)
                    }).catch(function (error) {
                        return res.send(error)
                    })
                }
            ], function (EleveCreate) {
                if (EleveCreate) {
                    return res.status(200).json({"message": "Enregistrement effectué", "error": false})
                } else {
                    return res.status(200).json({"message": "Erreur d'enregistrement", "error": false})
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    ReadEleveEtablissement: async (req, res) => {
        const {codeEtablissement} = req.params
        Model_Eleve.find({codeEtablissement}).then(eleveFound => {
            return res.send(eleveFound.reverse())
        }).catch(function (error) {
            console.log(error)
        })
    },
    EleveReadSelonAnnee: (req, res) => {
        const {id, codeEtablissement} = req.params
        console.log(id, codeEtablissement)

        let lookEleve = {
            $lookup: {
                from: "eleves",
                localField: "code_eleve",
                foreignField: "code_eleve",
                as: "eleve"
            }
        }
        let option = {
            $lookup: {
                from: "options",
                localField: "code_Option",
                foreignField: "code_Option",
                as: "option"
            }
        }
        let match = {
            $match: {
                code_Annee: id,
                codeEtablissement
            }
        }
        Model_EleveInscrit.aggregate([match, lookEleve, option]).then(EleveFound => {
            return res.status(200).json(EleveFound.reverse());
        }).catch(function (error) {
            return res.send(error)
        })
    },

    EleveRecherche: async (req, res) => {


        let eleve = {
            $lookup: {
                from: "eleves",
                localField: "code_eleve",
                foreignField: "code_eleve",
                as: "eleve"
            }
        }
        let etablissement = {
            $lookup: {
                from: "etablissements",
                localField: "codeEtablissement",
                foreignField: "codeEtablissement",
                as: "etablissement"
            }
        }
        let annee = {
            $lookup: {
                from: "annees",
                localField: "code_Annee",
                foreignField: "code_Annee",
                as: "annee"
            }
        }

        asyncLab.waterfall([
            function (done) {
                Model_Annee.findOne({active: true}).then(AnneeFound => {
                    if (AnneeFound) {
                        done(null, AnneeFound)
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            function (AnneeFound, done) {

                let matche = {
                    $match: {
                        code_Annee: AnneeFound.code_Annee
                    }
                }
                const match = {
                    $match: req.params
                }

                Model_EleveInscrit.aggregate([
                    match,
                    matche,
                    eleve,
                    etablissement,
                    annee
                ]).then(eleveFound => {
                    if (eleveFound) {
                        return res.status(200).json(eleveFound.reverse())
                    } else {
                        return false
                    }
                })
            }
        ])

    },
    InformationEleve: async (req, res) => {

        const {id} = req.params

        let match = {
            $match: {
                code_eleve: id
            }
        }

        let eleve = {
            $lookup: {
                from: "eleves",
                localField: "code_eleve",
                foreignField: "code_eleve",
                as: "eleve"
            }
        }
        let annee = {
            $lookup: {
                from: "annees",
                localField: "code_Annee",
                foreignField: "code_Annee",
                as: "annee"
            }
        }
        let etablissement = {
            $lookup: {
                from: "etablissements",
                localField: "codeEtablissement",
                foreignField: "codeEtablissement",
                as: "etablissement"
            }
        }
        let project = {
            $project: {
                "resultat": 1,
                "id": 1,
                "niveau": 1,
                "codeInscription": 1,
                "eleve.date_Naissance": 1,
                "eleve.lieu_naissance": 1,
                "eleve.filename": 1,
                "eleve.libre": 1,
                "eleve.nom": 1,
                "eleve.genre": 1,
                "annee.annee": 1,
                "etablissement.etablissement": 1
            }
        }
        let tuteur = {
            $lookup: {
                from: "tuteurs",
                localField: "eleve.codeTuteur",
                foreignField: "codeTuteur",
                as: "tuteur"
            }
        }

        Model_EleveInscrit.aggregate([
            match,
            eleve,
            annee,
            etablissement,
            tuteur,
            project
        ]).then(information => {
            if (information) {
                return res.status(200).json(information.reverse())
            } else {
                return false
            }
        })
    },
    Eleve_InscritEtablissement_Proved: async (req, res) => {
        try {

            const {code, codeAnnee} = req.body

            let optionFind = {
                $lookup: {
                    from: "Option",
                    localField: "code_Option",
                    foreignField: "code_Option",
                    as: "option"
                }
            }
            let match = {
                $match: {
                    code_Annee: codeAnnee
                }
            }

            await Model_Etablissement.find({code_proved: code}).then(ecoleFound => {
                if (ecoleFound.length > 0) {
                    Model_EleveInscrit.aggregate([match, optionFind]).then(allEleveInscrit => {
                        let tableau = []
                        let eleve
                        for (let i = 0; i < ecoleFound.length; i++) {
                            eleve = allEleveInscrit.filter(e => ecoleFound[i].codeEtablissement == e.codeEtablissement)

                            tableau = tableau.concat(eleve)
                        }
                        return res.send(tableau)
                    })
                } else {
                    return res.status(200).json({"message": "Aucune établissement trouvée", "error": true})
                }
            })

        } catch (error) {
            console.log(error)
        }
    },

    Eleve_Division: async (req, res) => {
        try {
            const {codeSecteur, codeAnnee} = req.body

            await asyncLab.waterfall([
                function (done) {
                    Model_Division.find({code_province: codeSecteur}).then(divisionFound => {

                        if (divisionFound.length > 0) {
                            done(null, divisionFound)
                        } else {
                            return res.status(200).json({"message": "Sous division non disponible", "error": true})
                        }
                    })
                },
                function (divisionFound, done) {

                    Model_Etablissement.find({}).then(all_etablissement => {
                        if (all_etablissement.length > 0) {
                            let tab_etablissement = []
                            let etab

                            for (let i = 0; i < divisionFound.length; i++) {
                                etab = all_etablissement.filter(et => et.code_proved === divisionFound[i].code_proved)
                                tab_etablissement = tab_etablissement.concat(etab)
                            }
                            done(null, tab_etablissement)
                        } else {
                            done(false)
                        }
                    })
                },
                function (tab_etablissement, done) {

                    let optionFind = {
                        $lookup: {
                            from: "Option",
                            localField: "code_Option",
                            foreignField: "code_Option",
                            as: "option"
                        }
                    }
                    let match = {
                        $match: {
                            code_Annee: codeAnnee
                        }
                    }

                    Model_EleveInscrit.aggregate([match, optionFind]).then(eleves => {
                        if (eleves.length > 0) {
                            let eleve
                            let tableau = []
                            for (let y = 0; y < tab_etablissement.length; y++) {
                                eleve = eleves.filter(el => el.codeEtablissement === tab_etablissement[y].codeEtablissement)
                                tableau = tableau.concat(eleve)
                            }
                            done(tableau)
                        } else {
                            done(false)
                        }
                    })
                }
            ], function (response) {
                if (response) {
                    return res.status(200).json(response)
                } else {
                    return res.status(200).json("Aucun élève enregistrer")
                }
            })

        } catch (error) {
            console.log(error)
        }
    },

    graphiqueEleve: (req, res) => {
        const {codeEtablissement} = req.params

        Model_Annee.findOne({active: true}).then(AnneeFound => {
            if (AnneeFound) {
                Model_EleveInscrit.aggregate([
                    {
                        $match: {
                            code_Annee: AnneeFound.code_Annee,
                            codeEtablissement
                        }
                    }, {
                        $unwind: "$niveau"
                    }, {
                        $group: {
                            _id: "$niveau",
                            classe: {
                                $sum: 1
                            }
                        }
                    }
                ]).then(sta => {
                    if (sta) {
                        return res.status(200).json(sta)
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }).catch(function (error) {
            console.log(error)
        })


    }
}
