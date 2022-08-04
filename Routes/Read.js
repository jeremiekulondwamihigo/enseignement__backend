const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { Read_Year, Year_Use } = require("../Controllers/Setting_Annee")
const { Read_section_Option } = require("../Controllers/Section_Option_Classe/Setting_Section")
const { Read_Option_Etablissement } = require("../Controllers/Section_Option_Classe/Setting_Option")
const { read_Domaine, read_Cours } = require("../Controllers/Domaine")
const { Read_Agent } = require("../Controllers/Agent")
const { read_secteur, read_one_secteur } = require("../Controllers/Secteur")
const { readUser } = require("../Controllers/Read")
const { Read_etablissement } = require("../Controllers/Etablissement")
const { One_agent, Read_Agent_Etablissement } = require("../Controllers/Other_Read")


router.route("/read_year").get(protect, Read_Year )
router.route("/read_section_option").get(protect, Read_section_Option)
router.route("/read_domaine/:code_option/:niveau").get(protect, read_Domaine)
router.route("/read_cours/:code_option/:niveau").get(protect, read_Cours)
router.route("/read_agent").get(protect, Read_Agent)
router.route("/read_secteur").get(protect, read_secteur)
router.route("/read_one_secteur/:code_secteur").get(protect, read_one_secteur)
router.route("/year_use").get(protect, Year_Use)
router.route("/user").get(readUser)
router.route("/read_etablissement/:secteur").get(Read_etablissement)
router.route("/oneAgent/:code_agent").get(protect, One_agent)
router.route("/allAgentEtablissement/:code_etablissement").get(protect, Read_Agent_Etablissement)
router.route("/etablissementOption/:id").get(Read_Option_Etablissement)


module.exports = router;