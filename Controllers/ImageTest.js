const fs = require("fs");
const sharp = require("sharp")

module.exports = {

    AgentIage : async(req, res)=>{
        fs.access("./config/Images/", (err)=>{
            if(err){
              fs.mkdirSync("./config/Images/")
            }
          })
          await sharp(req.file.buffer).resize({width:300, height:300}).toFile("./config/Images/"+req.file.originalname)
    }
}