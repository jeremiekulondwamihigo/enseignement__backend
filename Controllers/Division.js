const model_Division = require("../Models/Division");
const model_User = require("../Models/Users")
const { isEmpty, generateNumber, generateString } = require("../Fonctions/Static_Function")
const asyncLab = require("async")

module.exports = {
    AddDivision : async (req, res)=>{
        try {
            
            const { code_province, code_agent, denomination, code_proved, id, } = req.body
           
            

            if(isEmpty(code_province) || isEmpty(code_agent) || isEmpty(denomination) || isEmpty(code_proved)){
                return res.status(200).json({
                    "message":"Veuillez renseigner les champs gfgf",
                    "error":true
                })
            }
            const username = generateNumber(5);
            const password = generateNumber(6);
            const proved = code_proved.trim()
            const nom = denomination.toUpperCase().trim()

            asyncLab.waterfall([
                function(done){
                    model_Division.findOne({
                        code_proved : proved
                    }).then(response =>{
                        if(response){
                            return res.status(200).json({
                                "message":"Ce code existe déjà",
                                "error":true
                            })
                        }else{
                            done(null, true)
                        }
                    })
                    .catch(function(error){
                        return res.status(200).json({ "message":error, "catch":true })
                    })
                },
                function(response, done){
                    model_Division.findOne({
                        denomination : nom
                    }).then(response =>{
                        if(response){
                            return res.status(200).json({
                                "message":"Cette sous division existe déjà",
                                "error":true
                            })
                        }else{
                            done(null, true)
                        }
                    })
                    .catch(function(error){
                        return res.status(200).json({ "message":error, "catch":true })
                    })
                },
                function(response, done){
                    
                    model_Division.create({
                        code_province, code_agent, denomination, code_proved, id
                    })
                    .then(responseSave =>{
                        if(responseSave){
                            done(null, responseSave)
                        }else{
                            return res.status(200).json({
                                "message":"Erreur d'enregistrement",
                                "error":true
                            })
                        }
                    })
                    .catch(function(error){
                        return res.status(200).json({ "message":error, "catch":true })
                    })
                },
                function(responseSave, done){
                     model_User.create({
                        _id : responseSave._id, username, password, fonction : "proved"
                     }).then(userCreate =>{
                        if(userCreate){
                            done(userCreate)
                        }else{
                            return res.status(200).json({
                                "message":"Veuillez contacter l'hiérarchie car y a un probleme du serveur",
                                "error":true
                            })
                        }
                     })
                     .catch(function(error){
                        return res.status(200).json({ "message":error, "catch":true })
                    })
                },
                //Fonction envoyer message
                
            ], function(response){
                if(response){
                    return res.status(200).json({
                        "message":"Opération effectuée. Utilisateur :"+username+ " Password : "+password,
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
            return res.status(200).json({ "message":error, "catch":true })
        }
    }
}