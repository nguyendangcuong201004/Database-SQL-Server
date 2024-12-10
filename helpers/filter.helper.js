

module.exports = (req) => {
    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "InActive",
            status: "inactive",
            class: ""
        }
    ]


    if (req.query.status) {
        const index = filterStatus.findIndex((item) => {
            return item.status == req.query.status;
        })
        filterStatus[index].class = "active"
    }
    else {
        filterStatus[0].class = "active";
    }

    return filterStatus;

}