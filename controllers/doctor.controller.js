const { testConnection, executeQuery, executeQueryWithMessages } = require('../configs/database.js');
const sql = require("msnodesqlv8");

module.exports.index = async (req, res) => {

    const doctors = await executeQuery(`EXEC Get_top_5_busiest_doctors '2024-12-1', '2024-12-31', 'Visits', 1;`)

    for (const doctor of doctors) {
        const cccd = await executeQuery(`SELECT CIC FROM Staff WHERE StaffID = ${doctor.Doctor_ID}`)
        doctor.CCCD = cccd[0].CIC;
    }

    res.render("pages/doctors/index.pug", {
        pageTitle: "Danh sách Bác sĩ",
        doctors: doctors
    })
}


module.exports.findDoctors = async (req, res) => {
    const doctorCount = req.query.doctorCount;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const sortBy = req.query.sortBy;
    const minCount = req.query.minCount;
    const keyword = req.query.keyword;
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    const statusVisit = req.query.statusVisit;
    const statusVPatient = req.query.statusPatient;



    if (!startDate || !endDate || !sortBy || !minCount) {
        return res.render("pages/doctors/findDoctors.pug", { pageTitle: "Tìm Bác sĩ" });
    }

    let makeData = `EXEC Get_busiest_doctors_list ${doctorCount}, '${startDate}', '${endDate}', '${sortBy}', ${minCount};`;

    let conditions = [];

    if (keyword) {
        conditions.push(`Doctor_fullName LIKE '%${keyword}%'`);
    }

    if (statusVisit) {
        conditions.push(`NumberOfVisits > ${statusVisit}`);
    }

    if (statusVPatient) {
        conditions.push(`NumberOfPatients > ${statusVPatient}`);
    }

    if (sortKey && sortValue) {
        if (sortKey === "Doctor_fullName") {
            // conditions.push(`ORDER BY Doctor_fullName ${sortValue}`);
            console.log("haha")
        } else {
            makeData = `EXEC Get_top_5_busiest_doctors '${startDate}', '${endDate}', '${sortKey}', ${minCount};`;
        }
    }

    await executeQuery("DELETE FROM TempDoctors;")
    await executeQuery(`INSERT INTO TempDoctors
    ${makeData}`)

    console.log(`INSERT INTO TempDoctors
                    ${makeData}`)
    let doctors;

    if (conditions.length > 0){

        if (sortKey && sortValue && sortKey === "Doctor_fullName"){
            console.log(`SELECT * FROM TempDoctors WHERE ${conditions.join(' AND ')}
            ORDER BY Doctor_fullName ${sortValue};`)
            doctors = await executeQuery(`SELECT * FROM TempDoctors WHERE ${conditions.join(' AND ')}
            ORDER BY Doctor_fullName ${sortValue};`);
        }
        else {
            console.log(`SELECT * FROM TempDoctors WHERE ${conditions.join(' AND ')};`)
            doctors = await executeQuery(`SELECT * FROM TempDoctors WHERE ${conditions.join(' AND ')};`);
        }
    }
    else {
        doctors = await executeQuery(`SELECT * FROM TempDoctors;`);
    }

        // Thêm thông tin CCCD cho mỗi bác sĩ
    for (const doctor of doctors) {
        const cccd = await executeQuery(`SELECT CIC FROM Staff WHERE StaffID = ${doctor.Doctor_ID}`);
        doctor.CCCD = cccd[0]?.CIC || ''; // Nếu không tìm thấy CIC, trả về chuỗi rỗng
    }

    res.render("pages/doctors/index.pug", {
        pageTitle: "Danh sách Bác sĩ",
        doctors: doctors
    });

        
}


module.exports.findDoctorsPOST = async (req, res) => {


    const doctors = await executeQuery(`EXEC Get_top_5_busiest_doctors '${req.body.startDate}', '${req.body.endDate}', '${req.body.sortBy}', ${req.body.minCount};`)

    for (const doctor of doctors) {
        const cccd = await executeQuery(`SELECT CIC FROM Staff WHERE StaffID = ${doctor.Doctor_ID}`)
        doctor.CCCD = cccd[0].CIC;
    }


    res.render("pages/doctors/index.pug", {
        pageTitle: "Danh sách Bác sĩ",
        doctors: doctors
    })
}
