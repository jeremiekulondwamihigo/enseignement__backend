const jwt = require("jsonwebtoken");
const Model_Users = require("../Models/Model_Agent");
const ErrorResponse = require("../utils/errorResponse")
const { JWT_SECRET } = require("../config/data");
const Model_secteur = require("../Models/Model_Secteur")
const Model_Etablissement = require("../Models/Model_Etablissement")
const Model_Division = require("../Models/Division")
const asyncLab = require("async")

module.exports = {
readUser : async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        
        return  next(new ErrorResponse("Not authorization to access this route", 200));
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

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
        const lookDivision = {
            $lookup : {
                from : "divisions",
                localField : "code_proved",
                foreignField : "code_proved",
                as :"division"
            }
        }
        

        if(decoded.fonction === "nationale"){
           
            Model_secteur.aggregate([ look_agent, look_secteur ])
            .then( login=>{
                const data = login.filter(c => c._id == decoded.id)

                return res.status(200.).json({
                    fonction : decoded.fonction,
                    data 
                })
            }).catch(function(error){console.log(error)})

           
        }

        if(decoded.fonction === "province"){
            Model_secteur.aggregate([ look_agent, look_secteur ])
            .then( login=>{
                const data = login.filter(c => c._id == decoded.id)
                
                return res.status(200.).json({
                    fonction : decoded.fonction,
                    data 
                })
            }).catch(function(error){console.log(error)})
        }

        if(decoded.fonction === "proved"){
            Model_Division.aggregate([ look_agent ])
            .then( login=>{
                const data = login.filter(c => c._id == decoded.id)
        
                return res.status(200.).json({
                    fonction : decoded.fonction,
                    data 
                })
            }).catch(function(error){console.log(error)})
        }
        
        if(decoded.fonction === "etablissement"){

            Model_Etablissement.aggregate([ look_agent, lookDivision ])
            .then( login=>{
                const data = login.filter(c => c._id == decoded.id)
            
                return res.status(200.).json({
                    fonction : decoded.fonction,
                    data : data
                })
            }).catch(function(error){console.log(error)})

        }
        if(decoded.fonction === "enseignant"){

        }
        if(decoded.fonction === "tuteur"){

        }
        

        
        
        
    } catch (error) {
        return next(new ErrorResponse("Not authorization to access this id", 200))
    }
}
}