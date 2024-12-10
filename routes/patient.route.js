const express = require("express");
const router = express.Router()

const controller = require("../controllers/patient.controller.js")

router.get("/", controller.index)

router.get("/detail/:id", controller.detail)

router.get("/create", controller.create)

router.post("/create", controller.createPost)

router.get("/edit/:id", controller.edit)

router.patch("/edit/:id", controller.editPatch)

router.post("/edit/:id/:sdt", controller.addPhone)

router.patch("/delete/:id", controller.delete)

router.get("/bin", controller.bin)

router.patch("/bin/restore/:id", controller.binPatch)

router.get("/delete/:id/:sdt", controller.deletePhone)

module.exports = router;