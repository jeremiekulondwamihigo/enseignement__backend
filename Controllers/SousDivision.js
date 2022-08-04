const Model_Division = require("../Models/Model_ SousDivision");
const Model_Agent = require("../Models/Model_Agent");
const { isEmpty, generateNumber } = require("../Fonctions/Static_Function")
const asyncLab = require("async")
const Model_Users = require("../Models/Users")

module.exports = {

    Add_Division : (req, res)=>{
        try {
            const { code_province, code_division, denomination, code_agent, id } = req.body
            if(isEmpty(code_province) || isEmpty(code_division) || isEmpty(denomination) || isEmpty(code_agent)){
                return res.status(200).json({
                    "message":"Veuillez renseigner les champs",
                    "error":true
                })
            }
            const username = generateNumber(5)
            const password = generateNumber(6)

            asyncLab.waterfall([
                function(done){
                    Model_Agent.findOne({
                        code_agent
                    }).then(agentFound =>{
                        if(agentFound){
                            done(null, agentFound)
                        }else{
                            return res.status(200).json({
                                "message":"Code agent introuvable",
                                "error":true
                            })
                        }
                    })
                },
                function(agentFound, done){
                    Model_Division.findOne({
                        code_division
                    }).then(divisionFound =>{

                        if(divisionFound){

                            return res.status(200).json({
                                "message":"Rélancer l'enregistrement",
                                "error":true
                            })

                        }else{
                            done(null, agentFound)
                        }
                    })
                },
                function(agentFound, done){
                    Model_Division.create({
                        code_province, code_division, denomination, code_agent : agentFound.code_agent, id
                    }).then(divisionCreate =>{
                        if(divisionCreate){
                            done(null, divisionCreate, agentFound)
                        }else{
                            done(false)
                        }
                    })
                },
                function(divisionCreate, agentFound, done){
                    Model_Users.create({
                        username, password, _id : divisionCreate._id, fonction : "sousDivision"
                    }).then(userCreate =>{
                        if(userCreate){
                            //Envoyer Message
                            done(userCreate)
                        }else{
                            done(false)
                        }
                    })
                }
            ], function(userCreate){
                if(userCreate){
                    return res.status(200).json({
                        "message":"Username "+username+" password "+password,
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