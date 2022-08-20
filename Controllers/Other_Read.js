const Model_Agent = require("../Models/Model_Agent");
const Model_Etablissement = require("../Models/Enseignant_ecole")
const DomaineAgent = require("../Models/DomaineSituation")

module.exports = {
    One_agent : (req, res)=>{
        const { codeagent } = req.params

        Model_Agent.findOne({ code_agent : codeagent })
        .then(response =>{
            if(response){
                return res.send(response)
            }else{
                return res.send(false)
            }
        })
    },
    Read_Agent_Etablissement : (req, res)=>{
        const { codeEtablissement } = req.params
       

        var lookAgent = {
            $lookup : {
                from : "agents",
                localField : "code_agent",
                foreignField: "code_agent",
                as : "agent"
            }
        }
        var lookDomaine = {
            $lookup : {
                from : "domaineagents",
                localField : "agent.codeDomaine",
                foreignField: "codeDomaine",
                as : "domaine"
            }
        }
        var project = { $project : { "agent": 1, "domaine.title":1, "id":1}}
        const match = { $match : { code_etablissement : codeEtablissement}}
       
        Model_Etablissement.aggregate([match, lookAgent, lookDomaine, project]).then(response=>{
            return res.status(200).json(response.reverse())
        }).catch(function(error){console.log(error)})


        // const lookAgent = {
        //     $lookup : {
        //         from : "agents",
        //         localField : "code_agent",
        //         foreignField : "code_agent",
        //         as : "agent"
        //     }
        // }
        // const match = { $match : { code_etablissement : codeEtablissement}}
        
        // Model_Etablissement.aggregate([match, lookAgent ]).then(response =>{
           
        //     let table = []
        //     for(let i=0; i<response.length; i++){
        //         table.push(response[i].agent[0])
        //     }
        //     return res.send(table)
        // })
    },
    ReadAgentDomaine : (req, res)=>{
        
        var look = {
            $lookup:{
                from :"agents",
                localField : "codeDomaine",
                foreignField : "codeDomaine",
                as : "domaine"
            }
        }

        DomaineAgent.aggregate([ look ]).then(response =>{
            let valeur = []
            let id = 0
            for(let i=0; i < response.length; i++){
                valeur.push({
                    "total":response[i].domaine.length < 100 ? "00"+response[i].domaine.length : response[i].domaine.length,
                    "title": response[i].title,
                    "codeDomaine":response[i].codeDomaine,
                    "id": response[i]._id
                })
                
            }

            return res.send(valeur)
        })

        // DomaineAgent.find({}).then(response =>{
        //     return res.send(response.reverse())
        // })
    }
}