const mongoose = require("mongoose");

const schema = mongoose.Schema({
    id : {
        type:String,
        required:true
    },
    codeNiveau : {
        type:String,
        required:true
    },
    moyenne : {
        type:Number,
        required:true
    }
})
module.exports = model = new mongoose.model("RigeurAdmission", schema);
