const patientRoutes = require("./patient.route.js")



module.exports = (app) => {

    app.use("/patients", patientRoutes)
}