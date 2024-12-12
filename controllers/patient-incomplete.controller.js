const { executeQuery } = require("../configs/database");

module.exports.find = async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const keyword = req.query.keyword;
    const service = req.query.service;

    if (!startDate || !endDate ) {
        return res.render("pages/patients/findPatients.pug", {
            pageTitle: "Trang chủ"
        })
    }

    let query = `EXEC Get_patients_with_pending_services '${startDate}', '${endDate}';`;

    let conditions = [];

    if (keyword) {
        conditions.push(`Patient_name LIKE '%${keyword}%'`);
    }

    if (service) {
        const serviceName = service.replace(/-/g, ' ');
        conditions.push(`Service_Name LIKE '%${serviceName}%'`);
    }

    // if (statusVPatient) {
    //     conditions.push(`NumberOfPatients > ${statusVPatient}`);
    // }

    // if (status) {
    //     conditions.push(`1 = 1`); // Điều kiện mặc định, có thể bỏ qua hoặc thay đổi nếu cần
    // }

    // if (sortKey && sortValue) {
    //     if (sortKey === "Doctor_fullName") {
    //         conditions.push(`ORDER BY Doctor_fullName ${sortValue}`);
    //     } else {
            
    //         query = `EXEC Get_top_5_busiest_doctors '${startDate}', '${endDate}', '${sortKey}', ${minCount};`;
    //     }
    // }

    await executeQuery("DELETE FROM TempPatient;")
    await executeQuery(`INSERT INTO TempPatient
                    ${query}`)
    let patients;

    if (conditions.length > 0){
        patients = await executeQuery(`SELECT * FROM TempPatient WHERE ${conditions.join(' AND ')};`);
    }
    else {
        patients = await executeQuery(`SELECT * FROM TempPatient;`);
    }



    patients.forEach(patient => {
        const dateStr = patient.Appoinment_time;
        const date = new Date(dateStr);
        const formattedDate = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
        patient.atime = formattedDate;
    });

    // for (const patient of patients) {
    //     const cccd = await executeQuery(`SELECT CIC FROM Patient WHERE PatientID = ${patient.Doctor_ID}`);
    //     doctor.CCCD = cccd[0]?.CIC || ''; // Nếu không tìm thấy CIC, trả về chuỗi rỗng
    // }

    res.render("pages/patients/incomplete.pug", {
        pageTitle: "Danh sách Bệnh nhân",
        patients: patients
    });
}