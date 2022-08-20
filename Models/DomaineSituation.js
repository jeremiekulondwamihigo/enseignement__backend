const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id : {
        type: String,
        required:true,
        unique: true
    },
    title : {
        type: String,
        required:true,
        unique: true
    },
    codeDomaine : {
        type:String,
        required:true,
        unique:true
    }
})

const model = new mongoose.model("DomaineAgent", schema);
module.exports = model