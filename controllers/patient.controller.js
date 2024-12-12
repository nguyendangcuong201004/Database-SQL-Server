const { testConnection, executeQuery, executeQueryWithMessages } = require('../configs/database.js');
const sql = require("msnodesqlv8");

module.exports.index = async (req, res) => {
    const query = "SELECT * FROM Patient WHERE isDeleted = 0";
    const patients = await executeQuery(query);

    patients.forEach(patient => {
        const date = new Date(patient.Date_Of_Birth);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const formattedDate = `${day}/${month}/${year}`;
        patient.birth = formattedDate;
    });

    res.render("pages/patients/index.pug", {
        pageTitle: "Danh sách bệnh nhân",
        patients: patients,
    })
}

module.exports.detail = async (req, res) => {
    const patientid = req.params.id;

    const query = `SELECT * FROM Patient WHERE isDeleted = 0 AND PatientID = ${patientid}`;

    const row = await executeQuery(query);

    row.forEach(item => {
        const date = new Date(item.Date_Of_Birth);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const formattedDate = `${day}/${month}/${year}`;
        item.birth = formattedDate;
    });

    const patient = row[0];

    const phones = await executeQuery(`SELECT PatientPhoneNumber FROM Patient_Phone_Number WHERE PatientID = ${patient.PatientID}`);
    patient.phones = phones;

    res.render("pages/patients/detail.pug", {
        pageTitle: "Thông chi chi tiết của bệnh nhân",
        patient: patient,
    })
}

module.exports.create = (req, res) => {
    res.render("pages/patients/create.pug", {
        pageTitle: "Thêm bệnh nhân mới",
    })
}


module.exports.createPost = async (req, res) => {
    const query = ` EXEC insert_patient 
    @CIC = '${req.body.CCCD}',
    @FullName = '${req.body.FullName}',
    @Email = '${req.body.Email}',
    @PhoneNumber = '${req.body.Phone_Number}', 
    @Date_Of_Birth = '${req.body.Date_Of_Birth}',
    @Gender = '${req.body.Gender}',
    @Address = '${req.body.Address}';
                `
    // const { result, messages } = await executeQueryWithMessages(query)    

    // console.log(messages)

    // req.flash('success', `${messages}`);
    // res.redirect("back")
    try {
        const { result, messages } = await executeQueryWithMessages(query);

        console.log("Thông báo từ SQL Server:", messages);
        req.flash("success", `Thêm bệnh nhân mới thành công!`);
        res.redirect("back");
    } catch (error) {

        console.error("Lỗi khi thực thi query:", error);
        const noti = error.error.replace(/\[Microsoft\]\[ODBC Driver 17 for SQL Server\]\[SQL Server\]/, '');
        req.flash("error", `${noti}`);
        res.redirect("back");
    }
}


module.exports.edit = async (req, res) => {

    const PatientID = req.params.id;    

    const query = `SELECT * FROM Patient
                    WHERE PatientId = ${PatientID};`
    
    const patient = await executeQuery(query)      

    const patientDateOfBirth = new Date(patient[0].Date_Of_Birth);
    const formattedDate = patientDateOfBirth.toISOString().split('T')[0];

    patient[0].formattedDate = formattedDate

    const phones = await executeQuery(`SELECT PatientPhoneNumber FROM Patient_Phone_Number WHERE PatientID = ${patient[0].PatientID}`);

    res.render("pages/patients/edit.pug", {
        pageTitle: "Chỉnh sửa thông tin bệnh nhân",
        patient: patient[0],
        phones: phones
    })
}


module.exports.editPatch = async (req, res) => {

    const PatientID = req.params.id;

    
    const patient = await executeQuery(`SELECT CIC FROM Patient WHERE PatientID = '${PatientID}'`);

    // console.log(patient[0].CIC)

    const query = `EXEC update_patient 
    @CIC = '${patient[0].CIC}',
    @FullName = '${req.body.FullName}', 
    @Email = '${req.body.Email}', 
    @Date_Of_Birth = '${req.body.Date_Of_Birth}', 
    @Gender = '${req.body.Gender}', 
    @Address = '${req.body.Address}', 
    @isDeleted = 0;
                        `

    try {
        const { result, messages } = await executeQueryWithMessages(query);

        console.log("Thông báo từ SQL Server:", messages);
        req.flash("success", `Cập nhật thành công!`);
        res.redirect("back");
    } catch (error) {

        console.error("Lỗi khi thực thi query:", error);
        const noti = error.error.replace(/\[Microsoft\]\[ODBC Driver 17 for SQL Server\]\[SQL Server\]/, '');
        req.flash("error", `${noti}`);
        res.redirect("back");
    }

}

module.exports.delete = async (req, res) => {

    const PatientID = req.params.id;

    const patient = await executeQuery(`SELECT CIC FROM Patient WHERE PatientID = '${PatientID}'`);

    await executeQuery(`EXEC delete_patient @CIC = '${patient[0].CIC}';
                        `);


    req.flash('success', 'Cập nhật thông tin thành công!');
    res.redirect("back")
}

module.exports.bin = async (req, res) => {
    const query = "SELECT * FROM Patient WHERE isDeleted = 1";
    const patients = await executeQuery(query);

    patients.forEach(patient => {
        const date = new Date(patient.Date_Of_Birth);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const formattedDate = `${day}/${month}/${year}`;
        patient.birth = formattedDate;
    });

    res.render("pages/patients/bin.pug", {
        pageTitle: "Danh sách bệnh nhân đã xóa",
        patients: patients,
    })
}

module.exports.binPatch = async (req, res) => {

    const PatientID = req.params.id;

    await executeQuery(`UPDATE Patient
                        SET 
                            isDeleted = 0
                        WHERE PatientId = ${PatientID};
                        `);


    req.flash('success', 'Khôi phục bệnh nhân thành công!');
    res.redirect("/patients")
}


module.exports.addPhone = async (req, res) => {
    const patientId = req.params.id;
    const phone = req.params.sdt;
    
    const patient = await executeQuery(`SELECT CIC FROM Patient WHERE PatientID = '${patientId}'`);

    await executeQuery(`EXEC update_patient 
    @CIC = '${patient[0].CIC}',
    @PhoneNumber = '${phone}', 
    @isDeleted = 0; `)     

    res.redirect("back")
}

module.exports.deletePhone = async (req, res) => {
    const patientId = req.params.id;
    const phone = req.params.sdt;
    

    await executeQuery(`DELETE FROM Patient_Phone_Number 
                        WHERE PatientID = '${patientId}' AND PatientPhoneNumber = '${phone}'`)     

    res.redirect("back")
}