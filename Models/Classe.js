const mongoose = require('mongoose')

const schema = mongoose.Schema({
  niveau: { type: Number, required: true },
  code_Option: { type: String, required: true },
  resultat: { type: Number, required: true, default: 0 },
  effectif: { type: Number, required: true },
  codeClasse: { type: String, required: true, unique: true },
})
const model = new mongoose.model('Classe', schema)
module.exports = model
