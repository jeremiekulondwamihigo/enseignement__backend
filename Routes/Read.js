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


router.get("/readyear", protect, Read_Year )
router.get("/readsectionoption", protect, Read_section_Option)
router.get("/readdomaine/:codeoption/:niveau", protect, read_Domaine)
router.get("/readcours/:codeoption/:niveau", protect, read_Cours)
router.get("/readagent", protect, Read_Agent)
router.get("/readsecteur", protect, read_secteur)
router.get("/readonesecteur/:codesecteur", protect, read_one_secteur)
router.get("/yearuse", protect, Year_Use)
router.get("/user", readUser)
router.get("/readetablissement/:secteur", Read_etablissement)
router.get("/oneAgent/:codeagent", protect, One_agent)
router.get("/allAgentEtablissement/:codeetablissement", protect, Read_Agent_Etablissement)
router.get("/etablissementOption/:id", Read_Option_Etablissement)


module.exports = router;