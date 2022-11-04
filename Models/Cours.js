const mongoose = require('mongoose')

const schemaCours = mongoose.Schema({
  id: { type: String, required: true },
  branche: { type: String, required: true },
  maxima: { type: Number, required: true },
  classe: { type: Number, required: true },
  code_Option: { type: String, required: true }, //Option ou title = Education de base
  idCours: { type: String, required: true, unique: true },
  validExamen: { type: Boolean, required: true, default: true },
  identifiant: { type: String, required: false, default: undefined }, //code domaine ou sous-domaine si option = education de base
})
let valeur = new mongoose.model('Cours', schemaCours)
module.exports = valeur
