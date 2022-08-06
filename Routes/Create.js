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
const { Add_Etablissement } = require("../Controllers/Etablissement")
const { Add_Division } = require("../Controllers/SousDivision")
const { Save_Enseignant } = require("../Controllers/EnseignantEcole")
const { Add_Eleve } = require("../Controllers/Eleve")

const multer = require("multer")

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'agentImages/')
    },
    filename: (req, file, cb) => {

        const image = (file.originalname).split(".");
        cb(null, `${Date.now()}.${image[1]}`)
        
    },
    fileFilter: (req, file, cb) => {

        const ext = path.extname(file.originalname)
        
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})
var upload = multer({ storage: storage })

router.route("/add_year").post(protect, Add_Annee );
router.route("/add_section").post(protect, Add_Section);
router.route("/add_option").post(protect, Add_Option);
router.route("/add_domaine").post(protect, Add_Domaine);
router.route("/add_cours").post(protect, Add_Cours);
router.route("/sous_domaine").post(protect, Add_Sous_Domaine);
router.post("/agent", upload.single("file"),  Agent);
router.route("/add_secteur").post(protect, Add_Secteur)
router.route("/add_periode_secteur").post(protect, Add_Periode_Secteur)
router.route("/add_etablissement").post(Add_Etablissement)
router.route("/division").post(Add_Division)

router.route("/enseignantEcole").post(protect, Save_Enseignant)
router.route("/eleve").post(Add_Eleve)


module.exports = router;