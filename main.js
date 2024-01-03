const inputTask = document.getElementById('inputTask');
const dateInput = document.getElementById('date')
let addBtn = document.getElementById('addBtn');

const listContainer = document.getElementById('list-container');
let edit = false;
let editField;

function formatDate(inputDate) {
    let dateObject = new Date(inputDate);
    let day = dateObject.getDate().toString().padStart(2, '0');
    let month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    let year = dateObject.getFullYear().toString().slice(-4);
    return `${day}-${month}-${year}`;
}

function setDateWithTask() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    let todayClear = dt + '-' + month + '-' + year
    if (dateInput.value !== "") {
        inputTask.value = "(" + formatDate(dateInput.value) + ")" + " " + inputTask.value.charAt(0).toUpperCase() + inputTask.value.slice(1);
    } else {
        inputTask.value = "(" + todayClear + ")" + " " + inputTask.value.charAt(0).toUpperCase() + inputTask.value.slice(1);
    }
}

function isAlreadyPresent(searchTask) {
    const isPresent =
        pendArr.some(element => element.includes(searchTask)) || compArr.some(element => element.includes(searchTask));
    return isPresent;
}

function addTask() {
    if (edit) {
        editField.innerText = inputTask.value;
        savePendingData(editField.parentElement.parentElement.innerHTML)
        addBtn.innerText = "Add Task"
        inputTask.style.color = "black"
        edit = false
        inputTask.removeAttribute('readOnly')
        dateInput.removeAttribute('readOnly')
    } else if (inputTask.hasAttribute('readOnly')) {
        alert('You must present in "All" section to add new tasks.')
    } else if (inputTask.value === '') {
        inputTask.setAttribute('placeholder', 'You must write something.....')
        addBtn.innerText = "Error"
        inputTask.focus()
        setTimeout(() => {
            inputTask.setAttribute('placeholder', 'Enter a new Task....')
            addBtn.innerText = "Add Task"
        }, 1300)
    } else {
        setDateWithTask()
        let isTaskExist = isAlreadyPresent(inputTask.value)
        if (isTaskExist) {
            alert("Please enter a different date as this task already exists.")
        } else {
            let newLi = document.createElement("li")
            newLi.innerHTML =
                `<div class="left">
                <input type="checkbox" name="" class="checkBtn" title="Click here when task is completed">
                <p>${inputTask.value}</p>
            </div>
            <div class="right">
              <i class="fa-solid fa-pen-to-square" title="Edit" style="color: #000000;"></i>
              <i class="fa-solid fa-delete-left" title="Delete" style="color: #ff0000;"></i>
            </div>`;
            savePendingData(newLi.innerHTML)
            inputTask.focus()
            allTasks()
        }
    }
    inputTask.value = ""
    dateInput.value = ""
}

listContainer.addEventListener('click', (e) => {
    if (e.target.tagName === "INPUT") {
        e.target.nextElementSibling.classList.toggle("checked")
        if (e.target.checked) {
            e.target.parentElement.nextElementSibling.firstElementChild.style.visibility = "hidden"
            e.target.setAttribute("checked", "checked")
            saveCompletedData(e.target.parentElement.innerHTML)
            updatePending(e.target.parentElement.parentElement.innerHTML)
        } else {
            e.target.parentElement.nextElementSibling.firstElementChild.style.visibility = "visible"
            e.target.removeAttribute('checked')
            savePendingData(e.target.parentElement.parentElement.innerHTML)
            updateComplete(e.target.parentElement.innerHTML)
        }
    } else if (e.target.tagName === "I") {
        if (e.target.classList.contains('fa-delete-left')) {
            e.target.parentElement.parentElement.remove();
            saveDeletedData(e.target.parentElement.parentElement.firstElementChild.innerHTML)
            updatePending(e.target.parentElement.parentElement.innerHTML)
            updateCompAfterDel(e.target.parentElement.previousElementSibling.innerHTML)
            if (inputTask.hasAttribute('readOnly')) {
                pendingTasks()
            } else {
                allTasks()
            }
        } else {
            inputTask.value = e.target.parentElement.previousElementSibling.lastElementChild.innerText
            inputTask.style.color = "gray"
            inputTask.focus()
            addBtn.innerText = "Save"
            addBtn.setAttribute("title", "Click to save changes")
            dateInput.setAttribute('readOnly', 'readOnly')
            edit = true
            updatePending(e.target.parentElement.parentElement.innerHTML)
            inputTask.removeAttribute('readOnly')
            editField = e.target.parentElement.previousElementSibling.lastElementChild
        }
    } else {
        // do nothing..
    }
})


let delArr = JSON.parse(localStorage.getItem('Deleted')) || [];
let compArr = JSON.parse(localStorage.getItem('Completed')) || [];
let pendArr = JSON.parse(localStorage.getItem('Pending')) || [];

function updatePending(val) {
    val = val.replace(/\s*checked="checked"/, '').replace(/\s*class="checked"/, '');
    val = val.replace(/\s*visibility: hidden;/, '').replace('rgb(0, 0, 0)', '#000000');
    val = val.replace(/\s*visibility: visible;/, '').replace(/\s*class=""/, '');
    for (let i = 0; i < pendArr.length; i++) {
        pendArr[i] = pendArr[i].replace(/\s*class=""/, '').replace('rgb(0, 0, 0)', '#000000')
        pendArr[i] = pendArr[i].replace(/\s*visibility: visible;/, '');
    }
    let indexToDelete = pendArr.indexOf(val)
    if (indexToDelete !== -1) {
        pendArr.splice(indexToDelete, 1);
        localStorage.setItem("Pending", JSON.stringify(pendArr))
    }
}

function updateComplete(c) {
    for (let i = 0; i < compArr.length; i++) {
        compArr[i] = compArr[i].replace(/\s*checked="checked"/, '').replace('checked', '');
    }
    let indexToDelete = compArr.indexOf(c)
    if (indexToDelete !== -1) {
        compArr.splice(indexToDelete, 1);
        localStorage.setItem("Completed", JSON.stringify(compArr))
    }
}

function updateCompAfterDel(val) {
    compArr = compArr.filter(element => !delArr.includes(element));
    val = val.replace(/\s*checked="checked"/, '').replace('checked', '');
    localStorage.setItem("Completed", JSON.stringify(compArr))
    let indexToDelete = compArr.indexOf(val)
    if (indexToDelete !== -1) {
        compArr.splice(indexToDelete, 1);
        localStorage.setItem("Completed", JSON.stringify(compArr))
    }
}

function saveDeletedData(d) {
    delArr.push(d)
    let string = JSON.stringify(delArr)
    localStorage.setItem("Deleted", string)
}

function saveCompletedData(c) {
    compArr.push(c)
    let string = JSON.stringify(compArr)
    localStorage.setItem("Completed", string)
}

function savePendingData(p) {
    pendArr.push(p)
    let string = JSON.stringify(pendArr)
    localStorage.setItem("Pending", string)
}

inputTask.addEventListener('click', () => {
    if (inputTask.hasAttribute('readOnly') && !edit) {
        alert('You must present in "All" section to add new tasks.')
    }
})

dateInput.addEventListener('click', () => {
    if (dateInput.hasAttribute('readOnly') && !edit) {
        alert('You must present in "All" section to add new tasks.')
    }
})