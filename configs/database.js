const sql = require("msnodesqlv8");

// Cấu hình kết nối
const connectionString = `
  Driver={ODBC Driver 17 for SQL Server};
  Server=localhost;
  Database=master;
  UID=sa;
  PWD=123;
  Trusted_Connection=No;
`;

// Tạo hàm kiểm tra kết nối
const testConnection = () => {
    return new Promise((resolve, reject) => {
        sql.query(connectionString, "SELECT 1 AS test", (err, rows) => {
            if (err) {
                console.error("Connect SQL Server Fail !!!:", err.message);
                reject(err);
            } else {
                console.log("Connect SQL Server Successfull !!!");
                resolve(rows);
            }
        });
    });
};

// Hàm thực thi truy vấn
const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        sql.query(connectionString, query, params, (err, rows) => {
            if (err) {
                console.error("Lỗi truy vấn:", err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const executeQueryWithMessages = (query, params = []) => {
    return new Promise((resolve, reject) => {
        const messages = []; // Lưu trữ tất cả thông báo từ SQL Server

        // Lắng nghe sự kiện `info`
        const connection = sql.query(connectionString, query, params, (err, rows) => {
            if (err) {
                // Nếu lỗi xảy ra, reject với thông báo lỗi
                reject({ error: err.message, messages });
            } else {
                // Trả về kết quả truy vấn và các thông báo
                resolve({ result: rows, messages });
            }
        });

        // Bắt sự kiện `info` để thu thập thông báo từ SQL Server
        connection.on('info', (info) => {
            messages.push(info.message); // Thêm thông báo vào danh sách
            console.log("Thông báo từ SQL Server:", info.message); // Ghi log
        });
    });
};


module.exports = { testConnection, executeQuery, executeQueryWithMessages };
