const express = require("express");
const router = express.Router();
const {  getPrivateData } = require("../Controllers/private")
const { protect } = require("../middleware/auth");


router.get("/private", protect, getPrivateData)

router.get("/read", (req, res)=>{
    return res.send({"message":"je suis dans Private"})
})
module.exports = router;