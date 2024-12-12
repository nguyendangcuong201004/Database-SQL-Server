const express = require("express");
const router = express.Router()

const controller = require("../controllers/patient-incomplete.controller.js")

router.get("/find", controller.find)


module.exports = router;