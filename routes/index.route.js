const patientRoutes = require("./patient.route.js")
const checkSchedules = require("./check-schedules.route.js")
const homeRoutes = require("./homeRoute.route.js")
const doctorRoutes = require("./doctor.route.js")
const patientIncompleteRoutes = require("./patient-incomplete.route.js")

module.exports = (app) => {

    app.use("/", homeRoutes)

    app.use("/patients", patientRoutes)

    app.use("/check-schedules", checkSchedules)

    app.use("/doctors", doctorRoutes)

    app.use("/patient-incomplete", patientIncompleteRoutes)
}