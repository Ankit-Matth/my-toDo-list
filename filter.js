let isAllActive = false // Flag to indicate if all tasks are being displayed

function allTasks() {
    isAllActive = true
    listContainer.innerHTML = ""
    if (pendArr.length > 0 || compArr.length > 0) {
        if (pendArr.length > 0) {
            pendingTasks()
        }
        if (compArr.length > 0) {
            completedTasks()
        }
    } else {
        let li = document.createElement('li')
        if (delArr.length > 0 || compArr.length > 0 || pendArr.length > 0) {
            li.innerHTML = `<span>All existing tasks are completed or deleted.</span>`
        } else {
            li.innerHTML = `<span>You haven't added any tasks until now.</span>`
        }
        listContainer.appendChild(li)
    }
    isAllActive = false
    inputTask.removeAttribute('readOnly')
    dateInput.removeAttribute('readOnly')
}
allTasks()

function pendingTasks() {
    let pendingArr = JSON.parse(localStorage.getItem('Pending'))
    if (!isAllActive) {
        listContainer.innerHTML = ""
    }
    if (!(pendingArr === null) && pendingArr.length > 0) {
        for (let i = 0; i < pendingArr.length; i++) {
            let li = document.createElement('li')
            li.innerHTML = pendingArr[i]
            listContainer.appendChild(li)
        }
    } else {
        let li = document.createElement('li')
        li.innerHTML = `<span>You do not have any pending tasks.</span>`
        listContainer.appendChild(li)
    }
    // Disable input for adding new tasks & date
    inputTask.setAttribute('readOnly', 'readOnly')
    dateInput.setAttribute('readOnly', 'readOnly')
}

function completedTasks() {
    let CompletedArr = JSON.parse(localStorage.getItem('Completed'))
    if (!isAllActive) {
        listContainer.innerHTML = ""
    }
    // Display each completed task
    if (!(CompletedArr === null) && compArr.length > 0) {
        for (let i = 0; i < CompletedArr.length; i++) {
            let li = document.createElement('li')
            let div = document.createElement('div')
            div.classList.add('left')
            div.style.width = "100%"
            div.innerHTML = CompletedArr[i]
            li.appendChild(div)
            if (isAllActive) {
                let newDiv = document.createElement('div')
                newDiv.classList.add('right')
                div.style.width = "85%"
                newDiv.innerHTML =
                    `<i class="fa-solid fa-pen-to-square" title="Edit" style="color: rgb(0, 0, 0); visibility: hidden;"></i><i class="fa-solid fa-delete-left" title="Delete" style="color: #ff0000;"></i>`
                li.appendChild(newDiv)
            }
            listContainer.appendChild(li)
        }
    } else {
        let li = document.createElement('li')
        li.innerHTML = `<span>You do not have any completed tasks.</span>`
        listContainer.appendChild(li)
    }
     // Disable editing for completed tasks 
    let left = document.getElementsByClassName('left')
    Array.from(left).forEach(element => {
        if (!isAllActive) {
            element.firstElementChild.setAttribute("disabled", "disabled")
        }
    });
    // Disable input for adding new tasks & date
    inputTask.setAttribute('readOnly', 'readOnly')
    dateInput.setAttribute('readOnly', 'readOnly')
}

function deletedTasks() {
    let deletedArr = JSON.parse(localStorage.getItem('Deleted'))
    listContainer.innerHTML = ""
    // Display each deleted task
    if (!(deletedArr === null)) {
        for (let i = 0; i < deletedArr.length; i++) {
            let li = document.createElement('li')
            let div = document.createElement('div')
            div.classList.add('left')
            div.style.width = "100%"
            div.innerHTML = deletedArr[i]
            li.appendChild(div)
            listContainer.appendChild(li)
        }
    } else {
        let li = document.createElement('li')
        li.innerHTML = `<span>You do not have any deleted tasks.</span>`
        listContainer.appendChild(li)
    }
    // Disable editing for deleted tasks
    let left = document.getElementsByClassName('left')
    Array.from(left).forEach(element => {
        element.firstElementChild.setAttribute("disabled", "disabled")
    });
    // Disable input for adding new tasks & date
    inputTask.setAttribute('readOnly', 'readOnly')
    dateInput.setAttribute('readOnly', 'readOnly')
}

function clearAll() {
    localStorage.clear() // Clear all tasks from localStorage
    location.reload() // Reload the page to reflect changes
}