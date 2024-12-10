// Show alert

const showAlert = document.querySelector("[show-alert]");
if (showAlert){
    const time = showAlert.getAttribute("data-time");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, parseInt(time))
}
// Close alert
const closeAlert = document.querySelector("[close-alert]");
if (closeAlert){
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
}



const listButtonDelete = document.querySelectorAll("[button-delete]");
if(listButtonDelete.length > 0){
    const formDeleteButton = document.querySelector("[form-delete-button]");
    listButtonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa bệnh nhân này?");
            if (isConfirm){
                const PatientID = button.getAttribute("patient-id");
                const path = formDeleteButton.getAttribute("data-patch");
                const action = path + `/${PatientID}?_method=PATCH`;
                formDeleteButton.action = action;
                formDeleteButton.submit();
            }
        })
    })
}


const listButtonRestore = document.querySelectorAll("[button-restore]");
if (listButtonRestore.length > 0){
    const formRestoreButton = document.querySelector("[form-restore-button]");
    listButtonRestore.forEach((button) => {
        button.addEventListener("click", () => {
            const PatientID = button.getAttribute("patient-id");
            const path = formRestoreButton.getAttribute("data-patch");
            const action = path + `/${PatientID}?_method=PATCH`;
            formRestoreButton.action = action;
            formRestoreButton.submit();
        })
    })
}


const buttonAddPhone = document.querySelector('[button-add-phone]')
const inputPhone = document.querySelector('[input-phone]')

if (buttonAddPhone){
    const formAddPhone = document.querySelector('[form-add-phone]')
    buttonAddPhone.addEventListener("click", () => {
        const value = inputPhone.value;
        const path = formAddPhone.getAttribute('data-patch')
        const action = path + `/${value}`
        formAddPhone.action = action;
        formAddPhone.submit()
    })
}


const formSearch = document.querySelector("#form-search");
if (formSearch){
    let url = new URL(location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = e.target.elements.keyword.value.trim();
        if (value){
            url.searchParams.set("keyword", value);
        }
        else {
            url.searchParams.delete("keyword");
        }
        location.href = url.href;
    })
}



const listButtonStatus = document.querySelectorAll("[button-status]");

if (listButtonStatus.length > 0){

    let url = new URL(location.href);

    listButtonStatus.forEach((item) => {
        item.addEventListener("click", () => {


            if (item.getAttribute("button-status") != ""){
                url.searchParams.set("status", item.getAttribute("button-status"));              
            }
            else {
                url.searchParams.delete("status");   
            }
            location.href = url.href;
        })
    })
}   







const sort = document.querySelector("[sort]");
if (sort){
    let url = new URL(location.href);
    const sortSelect = sort.querySelector("[sort-select]");
    sortSelect.addEventListener("change", () => {
        const [sortKey, sortValue] = sortSelect.value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        location.href = url.href;
    })
    const selectedSortKey = url.searchParams.get("sortKey");
    const selectedSortValue = url.searchParams.get("sortValue");
    if(selectedSortKey && selectedSortValue){
        const stringSort = selectedSortKey + "-" + selectedSortValue;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}'`);
        optionSelected.selected = true;

    }
}

const sortClear = document.querySelector("[sort-clear]");
if(sortClear){
    let url = new URL(location.href);
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        location.href = url.href;
    })
}