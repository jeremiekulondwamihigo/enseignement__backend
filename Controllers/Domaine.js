const model_domaine = require("../Models/Domaine")
const ErrorResponse = require("../utils/errorResponse")
const asyncLab = require("async")
const { generateString, isEmpty } = require("../Fonctions/Static_Function")
const Model_Cours = require("../Models/Model_Cours")
const Model_Sous_Domaine = require("../Models/Model_Sous_Domaine")

module.exports = {

    Add_Domaine : (req, res, next)=>{

        const { domaine, classe, id, option } = req.body;
        
        if(!domaine || !classe){
            return next(new ErrorResponse("Veuillez renseigner les champs", 200));
        }
        asyncLab.waterfall([
            function(done){
                model_domaine.findOne({
                    domaine, classe 
                }).then(domaineFound =>{
                    if(domaineFound){
                        return next(new ErrorResponse("Domaine existant", 200));
                    }else {
                        done(null, domaineFound)
                    }
                })
                
            }, function(domaineFound, done){
                model_domaine.create(
                    {
                        id, 
                        domaine : domaine.toUpperCase(), 
                        code_domaine: generateString(8), 
                        classe, 
                        code_Option : option 
                    }
                )
                .then(response =>{
                    done(response)
                })
            } 
        ],
        function(response){
            if(response){
                return res.status(200).json({
                    "message":"Domaine enregistré",
                    "error":false
                })
            }else {
                return res.status(200).json({
                    "message":"Erreur d'enregistrement",
                    "error":true
                })
            }
        } 
        )
    },
    Add_Sous_Domaine : async (req, res)=>{

        const { code_domaine, titre_sous_domaine, id } = req.body;

        if(isEmpty(titre_sous_domaine)){
            return req.status(200).json({
                "message":"Veuillez renseigner le sous domaine",
                "error":true
            })
        }

        const code_sous_domaine = generateString(8)

        await asyncLab.waterfall([
            function(done){
               
                Model_Sous_Domaine.findOne({
                    code_sous_domaine
                }).then(codeFound =>{
                    done(null, codeFound)
                })
            }, 
            function(codeFound, done){

                if(!isEmpty(codeFound)){
                    done(false)
                }else{

                    Model_Sous_Domaine.create({
                        code_domaine, titre_sous_domaine, code_sous_domaine, id
                    }).then(sousDomaineCreate =>{
                        if(sousDomaineCreate){
                            console.log(sousDomaineCreate)
                            done(true)
                        }else{
                            done(false)
                        }
                    })
                }
            }
        ], function(result){
            if(result){
                return res.status(200).json({
                    "message":"Sous domaine enregistrer",
                    "error":false
                })
            }else{
                return res.status(200).json({
                    "message":"Relancer l'enregistrement",
                    "error":true
                })
            }
        })
        

    },
    Add_Cours : (req, res, next)=>{

        //si type_enregistrer = code_domaine : l'enregistrement se fait sens souci sans l'exigence du sous domaine
        //si type_enregistrer = code_sous_domaine : le code du domaine est aussi obligatoire

        const { type_enregistrer, appartenance, cours, id, maxima, niveau, code_option, code_domaine } = req.body

        const cour = cours.toUpperCase()

        Model_Cours.findOne(
            {
                cours : cour,
                [type_enregistrer] : appartenance,
                niveau, code_option
            }
        ).then(response =>{
            if(response){
                return next(new ErrorResponse("Cours existant", 200));
            }else{
                
                Model_Cours.create(
                    {
                        cours : cour, 
                        [type_enregistrer] : appartenance, 
                        code_Option : code_option,
                        id : id, 
                        code_cours : generateString(7), 
                        maxima,  niveau,
                        code_domaine
                    }
                ).then(coursCreate =>{
                    if(coursCreate){
                        return res.send({
                            "message":"Cours enregistrer",
                            "error": false
                        })
                    }else{
                        return res.send({
                            "message":"Erreur d'enregistrement",
                            "error":true
                        })
                    }
                })
            }
        })
    },

    read_Domaine : (req, res)=>{

        const { code_option, niveau } = req.params

        var lookSousDomaine = {
            $lookup : {
                from : "sous_domaines",
                localField : "code_domaine",
                foreignField : "code_domaine",
                as : "sousDomaine"
            },

            $lookup : {
                from : "domaines",
                localField : "sousDomaine.code_domaine",
                foreignField : "sousDomaine.code_domaine",
                as : "domaineSous"
            }
        }
        var lookDomaine = {
            $lookup : {
                from : "domaines",
                localField : "code_domaine",
                foreignField : "code_domaine",
                as : "domaine"
            }
        }
       
            
        if(parseInt(niveau) > 5){

            const match = { $match : { classe : parseInt(niveau)}}

            Model_Cours.aggregate([
                match, lookSousDomaine, lookDomaine
            ]).then(response =>{
                return res.send(response)
            })

            // model_domaine.aggregate([
            //     match, lookSousDomaine
            // ]).then(domaine =>{
            //     return res.send(domaine)
            // })

        }else{
            if(isEmpty(code_option)){
                return res.status(200).json({
                    "message":"Veuillez selectionner l'option",
                    "error":true
                })
            }
            const match = { $match : { classe : parseInt(niveau), code_Option : code_option}}
            
            model_domaine.aggregate([
                match, lookSousDomaine
            ]).then(domaine =>{
                return res.send(domaine)
            })

        }
    },
    read_Cours : (req, res)=>{

        const { code_option, niveau } = req.params
        
        let varLook_domaine = { $lookup: {
            from: 'domaines',
            localField: 'code_domaine',
            foreignField: 'code_domaine',
            as: 'domaine',
            }
        }
        
        let varLook_sous_domaine = {
            $lookup : {
                from :"sous_domaines",
                localField : "code_sous_domaine",
                foreignField : "code_sous_domaine",
                as : "sousDomaine"
            }
        }

        varGroup4 = { $project : {
            "id":1, "cours":1, "domaine.domaine":1, "sousDomaine.titre_sous_domaine" : 1,
            "maxima":1, "_id":0, "domaine.code_domaine":1, "sousDomaine.code_sous_domaine":1
        } };


        
        if(parseInt(niveau) > 5){

            varMach1 = { $match : { classe : parseInt(niveau) } }

            model_domaine.aggregate([
                varMach1, varLook_domaine, varLook_sous_domaine
            ]).then(response =>{
                return res.send(response)
            })
        }else{
            varMach1 = { $match : { niveau : parseInt(niveau), code_Option : code_option } }

            Model_Cours.aggregate([
                varMach1, varLook_domaine, varLook_sous_domaine, varGroup4
            ]).then(response =>{
                return res.send(response)
            })
        }
        
    }
}