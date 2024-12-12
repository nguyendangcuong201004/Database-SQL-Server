const { testConnection, executeQuery } = require('../configs/database.js');
const sql = require("msnodesqlv8");
const filterHelper = require("../helpers/filter.helper.js")


module.exports.findSchedule = async (req, res) => {
    res.render("pages/check-schedules/findDoctor.pug", {
        pageTitle: "Tìm kiếm Bác sĩ phù hợp"
    })
}


module.exports.find = async (req, res) => {

    const AppointmentDate = req.query.AppointmentDate;
    const AppointmentTime = req.query.AppointmentTime;
    const ServiceID = req.query.ServiceID;
    const keyword = req.query.keyword;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    let query = `SELECT * 
        FROM GetAvailableDoctors('${AppointmentDate} ${AppointmentTime}', ${ServiceID})`;

    // Mảng điều kiện WHERE
    let conditions = [];
    if (keyword) {
        conditions.push(`FullName LIKE '%${keyword}%'`);
    }

    // Ghép WHERE nếu có điều kiện
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Sắp xếp nếu có sortKey và sortValue
    if (sortKey && sortValue) {
        query += ` ORDER BY ${sortKey} ${sortValue}`;
    }

    const doctors = await executeQuery(query)

    doctors.forEach(doctor => {
        const dateStr = doctor.StartDateTime;
        const date = new Date(dateStr);
        const formattedDate = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
        doctor.atime = formattedDate;
    });

    doctors.forEach(doctor => {
        const dateStr = doctor.EndDateTime;
        const date = new Date(dateStr);
        const formattedDate = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
        doctor.etime = formattedDate;
    });


    res.render("pages/check-schedules/index.pug", {
        pageTitle: "Tìm kiếm Bác sĩ phù hợp",
        doctors: doctors
    })
}