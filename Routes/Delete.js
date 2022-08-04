const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { Read_Year } = require("../Controllers/Setting_Annee")



router.route("/read_year").get(protect, Read_Year )


module.exports = router;