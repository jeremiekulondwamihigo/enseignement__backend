const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { Modificate_Year } = require("../Controllers/Setting_Annee")
const { modificate_section } = require("../Controllers/Section_Option_Classe/Setting_Section");
const { Modification_Option } = require("../Controllers/Section_Option_Classe/Setting_Option")
const { Modification_Agent } = require("../Controllers/Agent")
const { Update_Secteur, Reset_Identifiant } = require("../Controllers/Secteur")
const { Attribution_Option } = require("../Controllers/Etablissement")



router.route("/update_year").put(protect, Modificate_Year);
router.route("/update_section").put(protect, modificate_section);
router.route("/update_option").put(protect, Modification_Option);
router.route("/update_agent").put(protect, Modification_Agent);
router.route("/reset_identifiant/:id").put(protect, Reset_Identifiant);
router.route("/update_secteur/:id").put(protect, Update_Secteur);
router.route("/attribution").put(Attribution_Option);



module.exports = router;