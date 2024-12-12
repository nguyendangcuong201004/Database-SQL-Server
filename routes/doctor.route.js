const express = require("express");
const router = express.Router()

const controller = require("../controllers/doctor.controller.js")

router.get("/find", controller.findDoctors)

router.get("/show", controller.index)

router.post("/find", controller.findDoctorsPOST)

module.exports = router;