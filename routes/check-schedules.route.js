const express = require("express");
const router = express.Router()

const controller = require("../controllers/check-schedules.controller.js")

router.get("/", controller.index)

router.get("/find/:id", controller.find)


module.exports = router;

// CREATE FUNCTION GetAvailableDoctorsForAppointment
// (
//     @AppointmentDate DATE,
//     @AppointmentTime TIME,
//     @ServiceType NVARCHAR(255)
// )
// RETURNS TABLE
// AS
// RETURN
// (
//     SELECT 
//         ws.Staff_ID AS DoctorID,
//         s.FullName,
//         ws.StartDateTime,
//         ws.EndDateTime,
//         ws.Status,
//         d.Specialty
//     FROM Workshift ws
//     INNER JOIN Staff s ON ws.Staff_ID = s.StaffID
//     INNER JOIN Doctors d ON ws.Staff_ID = d.DoctorID
//     WHERE 
//         ws.Status = 'Active'
//         AND s.Position = 'Doctor'
//         AND CAST(ws.StartDateTime AS DATE) = @AppointmentDate
//         AND CAST(@AppointmentDate AS DATETIME) + CAST(@AppointmentTime AS DATETIME) BETWEEN ws.StartDateTime AND ws.EndDateTime
//         AND d.Specialty = @ServiceType
// );
