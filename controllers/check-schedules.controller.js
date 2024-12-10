const { testConnection, executeQuery } = require('../configs/database.js');
const sql = require("msnodesqlv8");
const filterHelper = require("../helpers/filter.helper.js")


module.exports.index = async (req, res) => {

    const schedules = await executeQuery ("SELECT * FROM ConsultantSchedule")
    for (const schedule of schedules) {
        const patient = await executeQuery (`SELECT FullName FROM Patient WHERE PatientID = '${schedule.Have_PatientID}'`)
        schedule.fullName = patient[0].FullName;
        const dateStr = schedule.AppointmentDateTime;
        const date = new Date(dateStr);
        const formattedDate = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
        schedule.atime = formattedDate;
    }

    res.render("pages/check-schedules/shedule.pug", {
        pageTitle: "Danh sách các lịch tư vấn",
        schedules: schedules
    })
}



module.exports.find = async (req, res) => {

    const ConsultantID = req.params.id;
    
    const schedule = await executeQuery(`SELECT * FROM ConsultantSchedule WHERE ConsultantID = '${ConsultantID}'`)


    const dateStr = schedule[0].AppointmentDateTime;
    const date = new Date(dateStr);
    const formattedDate = date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
    const formattedHours = 
    String(date.getHours()).padStart(2, '0') + ':' +
    String(date.getMinutes()).padStart(2, '0') + ':' +
    String(date.getSeconds()).padStart(2, '0');
    

    const service = schedule[0].Type;
    
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    let query = `
    SELECT * 
    FROM GetAvailableDoctorsForAppointment('${formattedDate}', '${formattedHours}', '${service}')
`;

    if (keyword || status) {
        query += " WHERE 1=1"; 

        if (keyword) {
            query += ` AND FullName LIKE '%${keyword}%'`;
        }

        if (status) {
            if (status === 'w7h') {
                query += `
                AND CAST(StartDateTime AS DATE) = '2024-12-01'
                AND CONVERT(VARCHAR(8), StartDateTime, 108) = '07:00:00'
            `;
            } else if (status === 'w8h') {
                query += `
                AND CAST(StartDateTime AS DATE) = '2024-12-01'
                AND CONVERT(VARCHAR(8), StartDateTime, 108) = '08:00:00'
            `;
            }
        }
    }


    if (sortKey && sortValue) {
        query += ` ORDER BY ${sortKey} ${sortValue}`;
    }

    const doctors = await executeQuery(query)

    doctors.forEach(doctor => {
        const dateStr = doctor.StartDateTime;
        const date = new Date(dateStr);
        const adjustedDate = new Date(date.getTime() - (7 * 60 * 60 * 1000));
        const hours = adjustedDate.getHours().toString().padStart(2, '0');
        const formattedTime = `${hours}:00`;
        doctor.startTime = formattedTime;
    });

    doctors.forEach(doctor => {
        const dateStr = doctor.EndDateTime;
        const date = new Date(dateStr);
        const adjustedDate = new Date(date.getTime() - (7 * 60 * 60 * 1000));
        const hours = adjustedDate.getHours().toString().padStart(2, '0');
        const formattedTime = `${hours}:00`;
        doctor.endTime = formattedTime;
    });


    res.render("pages/check-schedules/index.pug", {
        pageTitle: "Danh sách các Bác sĩ",
        doctors: doctors,
    })
}