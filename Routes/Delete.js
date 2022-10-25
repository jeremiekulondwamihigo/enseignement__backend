const express = require("express")
const router = express.Router();
const {protect} = require("../middleware/auth");
const {DeleteYear} = require("../Controllers/Setting_Annee")

router.delete("/year/:code", DeleteYear)

module.exports = router
