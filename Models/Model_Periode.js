const mongoose = require("mongoose");

const schema = mongoose.Schema({
    code_periode : { type : String, required:true, unique:true },
    periode : { type:String, required:true, unique:true },
    id : { type: String, required:true, unique:true },
    active : { type:Boolean, required:true, default:false }
})
const model = new mongoose.model("Periode", schema)
module.exports = model