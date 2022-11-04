const mongoose = require('mongoose')

const model1 = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  domaine: { type: String, required: true },
  code_domaine: { type: String, required: true, unique: true },
  classe: { type: Number, required: true },
})

const model2 = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  titre_sous_domaine: { type: String, required: true },
  code_sous_domaine: { type: String, required: true, unique: true },
  code_domaine: { type: String, required: true },
})

const schemaDomaine = new mongoose.model('Domaine', model1)
const schemaSousDomaine = new mongoose.model('SousDomaine', model2)

module.exports = { schemaDomaine, schemaSousDomaine }
