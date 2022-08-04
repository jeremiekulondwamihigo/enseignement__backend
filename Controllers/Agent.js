const Model_Agent = require("../Models/Model_Agent")
const asyncLib = require("async")
const { isEmpty, generateNumber, generateString } = require("../Fonctions/Static_Function")
const ErrorResponse = require("../utils/errorResponse");
const Model_User = require("../Models/Users")




module.exports = {

    Agent : (req, res, next)=>{
        try {
            
            const { filename } = req.file
        const { agent_save, nom, fonction, dateNaissance, nationalite, 
            matricule, telephone, dateEngagement, etat, id, genre
        } = req.body

        //console.log(req.body)


        if(isEmpty(agent_save) || isEmpty(nom) || isEmpty(dateNaissance) || isEmpty(nationalite) || 
        isEmpty(telephone) || isEmpty(dateEngagement) || isEmpty(filename) || isEmpty(fonction)){
            return res.status(200).json({
                "message":"Veuillez renseigner le champs",
                "error":true
            })
        }

        const nomAgent = nom.toUpperCase()
       
        const code = generateNumber(6);
        const password = generateString(6)
        

        asyncLib.waterfall([
            function(done){
                Model_Agent.findOne({
                    code_agent : code
                }).then(response =>{
                    if(response){
                        return res.status(200).json({
                            "message":"Veuillez relancer l'enregistrement",
                            "error":true
                        })
                    }else{
                        done(null, true)
                    }
                })
            },
            function(agent, done){
                
                Model_Agent.create({
                    agent_save, 
                    nom : nomAgent, 
                    dateNaissance, 
                    nationalite, 
                    matricule, 
                    telephone, 
                    filename, 
                    code_agent : code, etat, genre,
                    fonction, dateEngagement, id
                }).then(agentSave =>{
                    if(agentSave){
                        Model_User.create({
                            username : agentSave.telephone,
                            password : password,
                            _id : agentSave._id,
                            fonction :"agent"

                        }).then(usercreate =>{
                            done(usercreate)
                        })
                    }
                })
            },
           
        ], function(result){
            if(result){
                return res.status(200).json({
                    "message":"username : "+result.username+ " password : "+password,
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
            return next(new ErrorResponse("Adresse Email incorrecte", 200));
        }
    },
    Read_Agent : (req, res)=>{
        Model_Agent.find({}).then(response=>{
            return res.status(200).json(response.reverse())
        })
    },

    Modification_Agent : (req, res)=>{
        const { id, data } = req.body

        Model_Agent.findOneAndUpdate({
            _id : id
        }, {
            $set: data
        }, null, (error, result)=>{
                if(error){
                    res.status(200).json({
                        "message":"errer:"+error,
                        "error":true
                    })
                }
                if(result){
                    return res.status(200).json({
                        "message" : "Modification effectuée",
                        "error":false
                    })
                }    
        })
            
    }
}