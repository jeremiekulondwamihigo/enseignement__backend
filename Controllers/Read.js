const jwt = require("jsonwebtoken");
const Model_Users = require("../Models/Model_Agent");
const ErrorResponse = require("../utils/errorResponse")
const { JWT_SECRET } = require("../config/data");
const Model_secteur = require("../Models/Model_Secteur")
const Model_Etablissement = require("../Models/Model_Etablissement")
const asyncLab = require("async")

module.exports = {
readUser : async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    // if(!token){
        
    //     return  next(new ErrorResponse("Not authorization to access this route", 200));
    // }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Model_Users.findById({_id : decoded.id});
        const etablissement = await Model_Etablissement.find({_id: decoded.id})

        console.log(decoded.fonction)

        const look_secteur = {
            $lookup : {
                from : "secteurs",
                localField : "code_secteur",
                foreignField : "code_secteur",
                as : "secteur"
            }
        }
        const look_agent = {
            $lookup : {
                from : "agents",
                localField : "code_agent",
                foreignField : "code_agent",
                as :"agent"
            }
        }

        if(decoded.fonction === "sousDivision"){

        }
        if(decoded.fonction === "etablissement"){

            Model_Etablissement.aggregate([ look_agent, look_secteur ])
            .then( login=>{
                const data = login.filter(c => c._id == decoded.id)
                return res.status(200.).json({
                    fonction : decoded.fonction,
                    data : data
                })
            })

        }
        if(decoded.fonction === "agent"){

        }
        if(decoded.fonction === "secteur"){

        }
       
        
        if(user){
            
            return res.status(200).json({
                user : user,
                etablissement : true
            })
        }else{
            asyncLab.waterfall([
                function(done){
                    Model_secteur.findById({_id : decoded.id}).then(secteurFound =>{
                        if(secteurFound){
                            done(null, secteurFound)
                        }else{
                            done(false)
                        }
                    })
                },
                function(secteur, done){
                    Model_Users.findOne({
                        code_agent : secteur.code_agent
                    }).then(agentFound =>{
                        if(agentFound){
                            done(agentFound, secteur)
                        }
                    })
                },
            ],
            function(agentFound, secteur){
                if(agentFound){
                    return res.status(200).json({
                        agent : agentFound,
                        user : secteur,
                        secteur : true
                    })
                }else{
                    return res.status(200).json({
                        error : true
                    })
                }
            }
            )     
        }
        
        
        
    } catch (error) {
        return next(new ErrorResponse("Not authorization to access this id", 200))
    }
}
}