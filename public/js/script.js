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