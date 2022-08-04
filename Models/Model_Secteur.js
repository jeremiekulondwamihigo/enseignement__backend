const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Secteur = mongoose.Schema({
    code_province : { type:String, required:true },
    code_agent : { type:String, required:true },
    denomination : { type:String, required:true },
    code_secteur : { type : String, required: true },
    id : { type : String, required: true },
    code_Annee : { type : String, required: false, default:"" },
})

Secteur.pre("save", async function(next){
    if(!this.isModified("password")){
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  Secteur.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);
  }

  const model = new mongoose.model("Secteur", Secteur)
  module.exports = model