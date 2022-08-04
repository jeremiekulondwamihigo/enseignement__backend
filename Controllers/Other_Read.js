const Model_Agent = require("../Models/Model_Agent");
const Model_Etablissement = require("../Models/Enseignant_ecole")

module.exports = {
    One_agent : (req, res)=>{
        const { code_agent } = req.params
        Model_Agent.findOne({ code_agent })
        .then(response =>{
            if(response){
                return res.send(response)
            }else{
                return res.send(false)
            }
        })
    },
    Read_Agent_Etablissement : (req, res)=>{
        const { code_etablissement } = req.params
        const lookAgent = {
            $lookup : {
                from : "agents",
                localField : "code_agent",
                foreignField : "code_agent",
                as : "agent"
            }
        }
        const project = {
            $project : {
                "agent":1, "id":1
            }
        }
        const match = { $match : { code_etablissement }}
        Model_Etablissement.aggregate([match, lookAgent ]).then(response =>{
            let table = []
            for(let i=0; i<response.length; i++){
                table.push(response[i].agent[0])
            }
        
            return res.send(table)
        })


    }
}