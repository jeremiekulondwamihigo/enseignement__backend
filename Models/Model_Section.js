const mongoose = require("mongoose")

const model = mongoose.Schema({
    id: {type:String, required:true, default: new Date()},
    section : {type:String, required:true},
    code_Section : {type:String, required:true}
})
const valeur = new mongoose.model("Section", model)
module.exports = valeur