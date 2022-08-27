const Model_Etablissement = require("../../Models/Model_Etablissement");
const Model_Agent = require("../../Models/Model_Agent");
const Model_Users = require("../../Models/Users");
const { isEmpty, generateString, generateNumber } = require("../../Fonctions/Static_Function")
const asyncLab = require("async")
const Model_Option = require("../../Models/Model_Option")


module.exports = {

    AddEtablissement : async (req, res)=>{
        try {
            
            const { etablissement, id, code_proved, code_agent } = req.body

            const code_etablissement = generateString(8);

            if(isEmpty(etablissement) || isEmpty(id) || isEmpty(code_proved) || isEmpty(code_agent)){

                return res.status(200).json({
                    "message":"Veuillez renseigner les champs",
                    "error":true
                });
            }
            const nom_etablissement = etablissement.toUpperCase()
            const password = generateNumber(7)

            await asyncLab.waterfall([
                function(done){
                    Model_Agent.findOne({
                        code_agent : code_agent
                    }).then(agentFound =>{
                        if(agentFound){
                            done(null, agentFound)
                        }else{
                            done(false)
                        }
                    }).catch(function(error){ return res.status(200).json({"message":error, "error":true})})
                },
                function(agentFound, done){
                    Model_Etablissement.findOne({
                        code_etablissement : code_etablissement
                    }).then(codeFound =>{
                        if(codeFound){
                            return res.status(200).json({"message":"Veuillez Relancer l'enregistrement", "error":true})
                        }else{
                            done(null, agentFound)
                        }
                    }).catch(function(error){ return res.status(200).json({"message":error, "error":true})})
                },
                function(agentFound, done){
                  Model_Etablissement.findOne({ code_proved, etablissement : nom_etablissement, })
                  .then(ecoleFound =>{
                    if(ecoleFound){
                        return res.status(200).json({
                            "message":"Cette école est enregistrée",
                            "error":true
                        })
                    }else{
                        done(null, agentFound)
                    }
                  }).catch(function(error){ return res.status(200).json({"message":error, "error":true})})
                },
                function(agentFound, done){
                    Model_Etablissement.create(
                        {
                            etablissement : nom_etablissement,
                            code_proved, id, 
                            code_agent : agentFound.code_agent,
                            codeEtablissement : code_etablissement,
                        }
                    ).then(etablissementCreate =>{
                        if(etablissementCreate){
                            done(null, etablissementCreate)
                        }else{
                            done(false)
                        }
                    }).catch(function(error){ return res.status(200).json({"message":error, "error":true})})
                },
                function(etablissementCreate, done){
                    Model_Users.create({
                        username : generateNumber(6),
                        password : password, 
                        fonction :"etablissement",
                        _id : etablissementCreate._id
                    }).then(userCreate =>{
                        if(userCreate){
                            done(userCreate)
                        }else{
                            done(false)
                        }
                    })
                }
            ],
            function(result){
                if(result){
                    return res.status(200).json({
                        "message":"Etablissement username :"+result.username+ " password "+password,
                        "error":false
                    })
                }else{
                    return res.status(200).json({
                        "message":"Un erreur est survenu",
                        "error":true
                    })
                }
            }
            )
        } catch (error) {
            console.log(error)
        }
    },
    Read_etablissement : (req, res)=>{

        const { proved } = req.params

        var lookagent = {
            $lookup : {
                from : "agents",
                localField : "code_agent",
                foreignField : "code_agent",
                as : "agent"
            }
        }
      
        var project = {
            $project : {
                "agent.nom":1, "agent.telephone":1, "secteur.denomination":1, "code_option":1, 
                "etablissement":1, "id":1, "code_etablissement":1, "active":1, "_id":0, "codeEtablissement":1
            }
        }
        var match = { $match : { code_proved : proved }}
        
        Model_Etablissement.aggregate([ match, lookagent, project ]).then(response =>{

            return res.send(response)
        })
    },
    Attribution_Option : async (req, res)=>{
        
        try {
            const { codeEtablissement, code_option } = req.body

            if(isEmpty(codeEtablissement) || isEmpty(code_option)){
                return res.status(200).json({
                    "message":"Erreur d'affectation",
                    "error":true
                })
            }
            await asyncLab.waterfall([
                function(done){
                    Model_Etablissement.findOne({ codeEtablissement : codeEtablissement})
                    .then(etablissement =>{
                     
                        if(etablissement){
                            done(null, etablissement)
                        }else{
                            done(false)
                        }
                    })
                },
                function(etablissement, done){
                    Model_Option.findOne({ code_Option: code_option })
                    .then(optionFound =>{

                        if(optionFound){
                            done(null, optionFound, etablissement)
                        }
                        if(!optionFound){
                            done(false)
                        }
                    })
                },
                function(optionFound, etablissement, done){

                    let initiale = []
                    for(let i=0; i < etablissement.code_option.length; i++){
                        if(etablissement.code_option[i]){
                            initiale.push(etablissement.code_option[i])
                        }
                    }
                    let valeur = initiale.filter(c =>c === code_option)
                    if(valeur.length > 0){

                        return res.status(200).json({
                            "message":"Cette option existe déjà",
                            "error":true
                        })
                    }else{
                        done(null, initiale, optionFound)
                    }
                },
                function(initiale, optionFound, done){

                    initiale.push(optionFound.code_Option)
                    
                    Model_Etablissement.findOneAndUpdate({ 
                        codeEtablissement : codeEtablissement
                    }, { $set: {
                        code_option : initiale
                    }}, null, (error, result)=>{
                        if(error){console.log(error)}
                        if(result){
                            done(result)
                        }else{
                            done(false)
                        }
                    })
                }
            ], function(result){
    
                if(result){
                    return res.status(200).json({
                        "message":"Affectation effectuée",
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