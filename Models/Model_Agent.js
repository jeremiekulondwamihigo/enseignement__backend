const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  agent_save : { type : String, required: true },
  nom : { type : String, required:true, unique : [true, "Ce nom existe deja"] },
  dateNaissance : { type : String, required:true },
  nationalite : { type :String, required:true },
  matricule : { type : String, required:false, default :"N.U"},
  telephone : { type : String, required: true, unique:true },
  filename : { type : String, required:false, unique: true },
  code_agent : { type : String, required:true, unique:true },
  dateEngagement : { type: String, required:true },
  etat : { type:String, required:false, default:"" },
  id : { type:String, required:true},
  fonction : { type:String, required:true},
  genre : { type :String, required: true},
  codeDomaine : { type: String, required:true}
})

const User = mongoose.model("Agent", UserSchema);
module.exports = User;
