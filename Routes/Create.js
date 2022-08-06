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

router.post("/addyear", protect, Add_Annee );
router.post("/addsection", protect, Add_Section);
router.post("/addoption", protect, Add_Option);
router.post("/adddomaine", protect, Add_Domaine);
router.post("/addcours", protect, Add_Cours);
router.post("/sousdomaine", protect, Add_Sous_Domaine);
router.post("/agent", upload.single("file"),  Agent);
router.post("/addsecteur", protect, Add_Secteur)
router.post("/addperiodesecteur", protect, Add_Periode_Secteur)
router.post("/addetablissement", Add_Etablissement)
router.post("/division", Add_Division)

router.route("/enseignantEcole").post(protect, Save_Enseignant)
router.route("/eleve").post(Add_Eleve)


module.exports = router;