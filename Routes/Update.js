const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { Modificate_Year } = require('../Controllers/Setting_Annee')
const {
  modificate_section,
} = require('../Controllers/Section_Option_Classe/Setting_Section')
const {
  Modification_Option,
} = require('../Controllers/Section_Option_Classe/Setting_Option')
const { Modification_Agent } = require('../Controllers/Agent')
const { Update_Secteur, Reset_Identifiant } = require('../Controllers/Secteur')
const {
  Attribution_Option,
} = require('../Controllers/Division/AddEtablissement')
const { ModifierCours } = require('../Controllers/Cours')

router.put('/updateyear', protect, Modificate_Year)
router.put('/updatesection', protect, modificate_section)
router.put('/updateoption', protect, Modification_Option)
router.put('/updateagent', protect, Modification_Agent)
router.put('/resetidentifiant/:id', protect, Reset_Identifiant)
router.put('/updatesecteur/:id', protect, Update_Secteur)
router.put('/cours', protect, ModifierCours)

router.put('/attribution', protect, Attribution_Option)

module.exports = router
