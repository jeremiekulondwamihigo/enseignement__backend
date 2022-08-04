const mongoose = require("mongoose")

const model = mongoose.Schema({
    id: {type:String, required:true,},
    option : {type:String, required:true},
    code_Option : {type:String, required:true},
    code_Section : { type:String, required:true},
    max : { type:Number, required:true, default:0}
})
const valeur = new mongoose.model("Option", model)
module.exports = valeur