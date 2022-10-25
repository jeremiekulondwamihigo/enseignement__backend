const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { Add_Annee } = require("../Controllers/Setting_Annee");
const { Add_Section } = require("../Controllers/Section_Option_Classe/Setting_Section");
const { Add_Option } = require("../Controllers/Section_Option_Classe/Setting_Option");
const { Add_Domaine, Add_Cours, Add_Sous_Domaine } = require("../Controllers/Domaine")
const {  Agent } = require("../Controllers/Agent")
const { Add_Secteur } = require("../Controllers/Secteur")
const { Add_Periode_Secteur } = require("../Controllers/Parameter_Detail_Secteur")
const { AddEtablissement } = require("../Controllers/Division/AddEtablissement")
const { Save_Enseignant } = require("../Controllers/Etablissement/EnseignantEcole")
const { PremiereEnregistrement, ReInscription } = require("../Controllers/Etablissement/Eleve")
const { login } = require("../Controllers/auth");
const { AddDivision } = require("../Controllers/Division")
const { DomaineAgent } = require("../Controllers/DomaineAgent")
const { Tuteur } = require("../Controllers/Tuteur/Tuteur")

 const multer = require("multer")
const storage = multer.memoryStorage()

const apload = multer({storage})




router.post("/addyear", protect, Add_Annee );
router.post("/addsection", protect, Add_Section);
router.post("/addoption", protect, Add_Option);
router.post("/adddomaine", protect, Add_Domaine);
router.post("/addcours", protect, Add_Cours);
router.post("/sousdomaine", protect, Add_Sous_Domaine);
router.post("/agent", apload.single("file"),  Agent);
router.post("/addsecteur", protect, Add_Secteur)
router.post("/addperiodesecteur", protect, Add_Periode_Secteur)
router.post("/domaineAgent", DomaineAgent)

//ETABLISSEMENT
router.post("/inscription", ReInscription)
router.post("/enseignantEcole", protect, Save_Enseignant)
router.post("/eleve", PremiereEnregistrement)

//POST_DIVISION
router.post("/division", protect, AddDivision)
router.post("/addetablissement", AddEtablissement)
//FIN POST_DIVISION

//TUTEUR
router.post("/tuteur", Tuteur)
//FIN TUTEUR
router.post("/login", login);




module.exports = router;