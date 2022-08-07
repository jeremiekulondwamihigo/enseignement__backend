const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth");




router.post("/register", register);
router.post("/login", login);

router.get("/read", (req, res)=>{
    return res.send({"message":"je suis dans authen"})
})

module.exports = router;