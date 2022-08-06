const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { Read_Year } = require("../Controllers/Setting_Annee")



router.route("/readyear").get(protect, Read_Year )


module.exports = router;