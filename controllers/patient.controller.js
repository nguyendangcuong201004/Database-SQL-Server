const { testConnection, executeQuery } = require('../configs/database.js');
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

    console.log(patient)

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
    const query = ` INSERT INTO Patient (FullName, Email, Date_Of_Birth, Gender, Address, Phone_Number)
                    VALUES
                    ('${req.body.FullName}', '${req.body.Email}', '${req.body.Date_Of_Birth}', '${req.body.Gender}', '${req.body.Address}', '${req.body.Phone_Number}');
                `
     
    await executeQuery(query)           
    req.flash('success', 'Thêm mới bệnh nhân thành công!');
    res.redirect("back")
}


module.exports.edit = async (req, res) => {

    const PatientID = req.params.id;

    const query = `SELECT * FROM Patient
                    WHERE PatientId = ${PatientID};`
    
    const patient = await executeQuery(query)      

    const patientDateOfBirth = new Date(patient[0].Date_Of_Birth);
    const formattedDate = patientDateOfBirth.toISOString().split('T')[0];

    patient[0].formattedDate = formattedDate

    res.render("pages/patients/edit.pug", {
        pageTitle: "Chỉnh sửa thông tin bệnh nhân",
        patient: patient[0]
    })
}


module.exports.editPatch = async (req, res) => {

    const PatientID = req.params.id;

    await executeQuery(`UPDATE Patient
                        SET 
                            FullName = '${req.body.FullName}', 
                            Email = '${req.body.Email}', 
                            Date_Of_Birth = '${req.body.Date_Of_Birth}', 
                            Gender = '${req.body.Gender}', 
                            Address = '${req.body.Address}', 
                            Phone_Number = '${req.body.Phone_Number}'
                        WHERE PatientId = ${PatientID};
                        `);


    req.flash('success', 'Cập nhật thông tin thành công!');
    res.redirect("back")
}

module.exports.delete = async (req, res) => {

    const PatientID = req.params.id;


    await executeQuery(`UPDATE Patient
                        SET 
                            isDeleted = 1
                        WHERE PatientId = ${PatientID};
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