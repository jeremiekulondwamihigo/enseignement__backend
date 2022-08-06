const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { Modificate_Year } = require("../Controllers/Setting_Annee")
const { modificate_section } = require("../Controllers/Section_Option_Classe/Setting_Section");
const { Modification_Option } = require("../Controllers/Section_Option_Classe/Setting_Option")
const { Modification_Agent } = require("../Controllers/Agent")
const { Update_Secteur, Reset_Identifiant } = require("../Controllers/Secteur")
const { Attribution_Option } = require("../Controllers/Etablissement")



router.route("/updateyear").put(protect, Modificate_Year);
router.route("/updatesection").put(protect, modificate_section);
router.route("/updateoption").put(protect, Modification_Option);
router.route("/updateagent").put(protect, Modification_Agent);
router.route("/resetidentifiant/:id").put(protect, Reset_Identifiant);
router.route("/updatesecteur/:id").put(protect, Update_Secteur);
router.route("/attribution").put(Attribution_Option);



module.exports = router;