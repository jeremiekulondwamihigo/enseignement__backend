const Model_Secteur = require("../Models/Model_Secteur")
const { isEmpty, generateString } = require("../Fonctions/Static_Function")
const asyncLab = require("async")
const ErrorResponse = require("../utils/errorResponse")
const Model_Agent = require("../Models/Model_Agent")
const Model_User = require("../Models/Users")

module.exports = {

    Add_Secteur : (req, res, next)=>{
        try {
            const { code_province, code_agent, denomination, code_secteur, id } = req.body

            if(isEmpty(code_province) || isEmpty(code_agent) || isEmpty(denomination) || isEmpty(code_secteur)){
                return res.status(200).json({
                    "message":"Veuillez renseigner le champs",
                    "error":true
                })
            }
            const username = generateString(5)
            const password = generateString(6)

            asyncLab.waterfall([
                function(done){
                    Model_Secteur.findOne({
                        code_secteur
                    }).then(codeFound =>{
                        if(codeFound){
                            return next(new ErrorResponse("Ce Code existant déjà", 200));
                        }else{
                            done(null, true)
                        }
                    })
                },
                function(code, done){
                    Model_Agent.findOne({
                        code_agent
                    }).then(AgentFound =>{
                        if(AgentFound){
                            done(null, AgentFound)
                        }else{
                            return next(new ErrorResponse("Agent non identifier", 200));
                        }
                    })
                },
                function(agent, done){
                    Model_Secteur.create({
                        code_province, code_agent : agent.code_agent, denomination, 
                        code_secteur, id, 
                    }).then(secteurCreate =>{
                        if(secteurCreate){
                            done(null, secteurCreate)
                        }else{
                            done(false)
                        }
                    })
                },
                function(secteurCreate, done){
                    Model_User.create({
                        username, password, _id : secteurCreate._id, fonction : "secteur"
                    }).then(usercreate =>{
                        if(usercreate){
                            done(null, usercreate)
                        }else{
                            done(null, false)
                        }
                    })
                },
                function(usercreate, done){
                    //cette fonction permettra d'envoyer le message à l'agent concerner
                    done(usercreate)
                }
            ], 
            function(result){
                if(result){
                    return res.status(200).json({
                        "message":"username "+result.username+ " password "+password,
                        "error":false
                    })
                }else{
                    return next(new ErrorResponse("Erreur d'enregistrement", 200));
                }
            })

            Model_Secteur.findOne({
                code_secteur
            })

        } catch (error) {
            console.log(error)
        }
    },
    Reset_Identifiant : (req, res, next)=>{
        try {
            const { id } = req.params
            const username = generating(5);
            const password = generating(5)

            asyncLab.waterfall([
                function(done){
                    Model_Secteur.findOne({
                        _id : id
                    }).then(secteur_Found =>{
                        if(secteur_Found){
                            done(null, secteur_Found)
                        }else{
                            return next(new ErrorResponse("Secteur non introuvable", 200))
                        }
                    })
                },
                function(secteur_Found, done){
                    Model_Agent.findOne({
                        code_agent : secteur_Found.code_agent
                    }).then(Agent_Found =>{
                        if(Agent_Found){
                            done(null, Agent_Found)
                        }else{
                            return next(new ErrorResponse("Agent introuvable", 200))
                        }
                    })
                }, function(Agent_Found, done){
                    Model_Secteur.findOneAndUpdate({
                        _id: id
                    }, {
                        $set:{
                            username : username,
                            password : password
                        }
                    }, null, (error, result)=>{
                        if(error)throw error
                        if(result){
                            done(null, result, Agent_Found)
                        }
                    })
                },
                function(result, Agent_Found, done){
                    //Ici j'envoie le message de modification de l'utilisateur
                    done(true)
                }
            ], function(result){
                if(result){
                    return res.status(200).json({
                        "message":"Modification effectuée",
                        "error":false
                    })
                }else{
                    return next(new ErrorResponse("Erreur de modification", 200))
                }
            })


            
        } catch (error) {
            console.log(error)
        }

    },
    Update_Secteur : (req, res)=>{
        const { id } = req.params
        const { data } = req.body
        try {
            Model_Secteur.findOneAndUpdate({
                _id : id
            }, {
                $set: data
            }, null, (error, result)=>{
                if(error)throw error
                if(result){
                    return res.status(200).json({
                        "message":"Modification effectuée",
                        "error":false
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }

    },
    read_secteur :(req, res)=>{
        Model_Secteur.find({}).then(response =>{
            if(response){
                return res.status(200).json(response.reverse())
            }
        })
    },
    read_one_secteur : (req, res)=>{
        const { code_secteur } = req.params

        var look_Agent = {
            $lookup : {
                from : "agents",
                localField : "code_agent",
                foreignField : "code_agent",
                as : "agent"
            }
        }
        var look_Annee = {
            $lookup : {
                from : "annees",
                localField : "code_Annee",
                foreignField : "code_Annee",
                as :"annee"
            }
        }

        var match = { $match : { code_secteur }}

        var project ={ $project : {
            "agent.nom":1, "denomination":1, "code_secteur":1, "code_province":1, "agent.filename":1,
            "annee.annee":1

        }}

        Model_Secteur.aggregate([
            match, look_Agent, look_Annee, project
        ]).then(secteurFound =>{
            return res.status(200).json(secteurFound)
        })
    }
}