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


router.route("/readyear").get(protect, Read_Year )
router.route("/readsectionoption").get(protect, Read_section_Option)
router.route("/readdomaine/:codeoption/:niveau").get(protect, read_Domaine)
router.route("/readcours/:codeoption/:niveau").get(protect, read_Cours)
router.route("/readagent").get(protect, Read_Agent)
router.route("/readsecteur").get(protect, read_secteur)
router.route("/readonesecteur/:codesecteur").get(protect, read_one_secteur)
router.route("/yearuse").get(protect, Year_Use)
router.route("/user").get(readUser)
router.route("/readetablissement/:secteur").get(Read_etablissement)
router.route("/oneAgent/:codeagent").get(protect, One_agent)
router.route("/allAgentEtablissement/:codeetablissement").get(protect, Read_Agent_Etablissement)
router.route("/etablissementOption/:id").get(Read_Option_Etablissement)


module.exports = router;