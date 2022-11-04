const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { Read_Year, Year_Use } = require('../Controllers/Setting_Annee')
const {
  Read_section_Option,
} = require('../Controllers/Section_Option_Classe/Setting_Section')
const {
  Read_Option_Etablissement,
  read_Option,
} = require('../Controllers/Section_Option_Classe/Setting_Option')
const {
  readDomaine,
  read_Cours,
  readSousDomaine,
} = require('../Controllers/Domaine')
const { Read_Agent } = require('../Controllers/Agent')
const { read_secteur, read_one_secteur } = require('../Controllers/Secteur')
const {
  Read_etablissement,
} = require('../Controllers/Division/AddEtablissement')
const {
  One_agent,
  Read_Agent_Etablissement,
  ReadAgentDomaine,
} = require('../Controllers/Other_Read')
const { readUser } = require('../Controllers/Read')
const {
  ReadEleveEtablissement,
  EleveRecherche,
  graphiqueEleve,
  EleveReadSelonAnnee,
  InformationEleve,
  Eleve_InscritEtablissement_Proved,
  Eleve_Division,
} = require('../Controllers/Etablissement/Eleve')
const { ReadCoursSimple } = require('../Controllers/Cours')

router.get('/readyear', protect, Read_Year)
router.get('/readsectionoption', protect, Read_section_Option)
router.get('/readdomaine/:codeoption/:niveau', protect, readDomaine)
router.get('/readcours/:codeoption/:niveau', protect, read_Cours)
router.get('/readagent', protect, Read_Agent)
router.get('/readsecteur', protect, read_secteur)
router.get('/readonesecteur/:codesecteur', protect, read_one_secteur)
router.get('/yearuse', protect, Year_Use)
router.get('/oneAgent/:codeagent', protect, One_agent)
router.get(
  '/allAgentEtablissement/:codeEtablissement',
  Read_Agent_Etablissement,
)
router.get('/etablissementOption/:codeEtablissement', Read_Option_Etablissement)
router.get('/user', readUser)

//NATIONALE
router.get('/domaine', protect, ReadAgentDomaine)
router.get('/sousdomaine/:classe', protect, readSousDomaine)
router.get('/coursimple/:classe/:code_Option', protect, ReadCoursSimple)
//FIN NATIONALE

//DIVISION
router.get('/readetablissement/:proved', protect, Read_etablissement)
router.get('/option', protect, read_Option)
//FIN DIVISION

//ETABLISSEMENT
router.get('/readEleve/:codeEtablissement', protect, ReadEleveEtablissement)
router.get('/singlerecherche/:codeEtablissement', protect, EleveRecherche)
router.get(
  '/readEleveSelonAnnee/:id/:codeEtablissement',
  protect,
  EleveReadSelonAnnee,
)
router.get('/informationeleve/:id', InformationEleve)
router.get('/eleveproved', Eleve_InscritEtablissement_Proved)
router.get('/elevedivision', Eleve_Division)
router.get('/readGraphique/:codeEtablissement', graphiqueEleve)
//FIN ETABLISSEMENT

module.exports = router
