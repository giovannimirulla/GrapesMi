function selectPage(event) {
    if (event.currentTarget.textContent == "Logout") {
        window.location.href = '../logout.php';
    }
    for (let button of buttons) {
        button.classList.remove("selected")
    }
    event.currentTarget.classList.add("selected")

    showPage(event.currentTarget.textContent)
}

function showPage(selectPage) {
    for (let page of pages) {
        page.classList.add("hidden")
    }
    document.querySelector("#" + selectPage.replace(" ", "-")).classList.remove("hidden")
}


const menu = document.querySelector(".menu")
buttonsMenu = ["Dashboard", "Deploy", "New project", "Profile", "Logout"]
for (let buttonTitle of buttonsMenu) {
    let a = document.createElement("a");
    if (buttonTitle == "Dashboard") a.setAttribute("class", "selected");
    else if (buttonTitle == "Logout") a.setAttribute("id", "logout");
    a.classList.add("button");
    a.addEventListener("click", selectPage);
    a.textContent = buttonTitle;
    menu.appendChild(a);
}

const buttons = document.querySelectorAll(".menu .button")
const pages = document.querySelectorAll(".container .page")
showPage(buttonsMenu[0])


const textInputs = document.querySelectorAll("#Profile .textBar input")

function fetchResponse(response) {
    if (!response.ok) return null;
    return response.json();
}


function update(event) {
    if (event.currentTarget.name == "Username") {
        checkUsername()
    } else if (event.currentTarget.name == "Email") {
        checkEmail()
    } else {
        if (event.currentTarget.name == "Nome") {
            let surname = document.querySelector(".info h3").textContent.split(" ")[1];
            document.querySelector(".info h3").textContent = event.currentTarget.value + " " + surname;
        } else if (event.currentTarget.name == "Cognome") {
            let name = document.querySelector(".info h3").textContent.split(" ")[0];
            document.querySelector(".info h3").textContent = name + " " + event.currentTarget.value;
        }
        fetch("../api/updateProfile.php?id=" + user + "&" + event.currentTarget.name + "=" + event.currentTarget.value);
    }
}

function doupload() {
    let data = document.querySelector("#uploadOriginal").files[0];
    const formData = new FormData()
    formData.append('sendimage', data)
    fetch('../api/inputFile.php?id=' + user, {
        method: 'POST',
        body: formData
    })
};

for (let textInput of textInputs) {
    textInput.addEventListener("blur", update)
}



document.querySelectorAll(".dropZoneInput").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".dropZone");

    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("dropZoneOver");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("dropZoneOver");
        });
    });

    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("dropZoneOver");
    });
});


function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".dropZoneThumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".dropZonePrompt")) {
        dropZoneElement.querySelector(".dropZonePrompt").remove();
    }


    thumbnailElement.classList.remove("hidden")


    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
            if (dropZoneElement === document.querySelector("#profileImage")) {
                let pPropics = document.querySelectorAll("p.propic");
                let imgPropics = document.querySelectorAll("img.propic");
                for (let p of pPropics) {
                    p.classList.add("hidden")
                }
                for (let img of imgPropics) {
                    img.classList.remove("hidden")
                    img.src = reader.result;
                }
            }
        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
    if (dropZoneElement === document.querySelector("#profileImage")) doupload()
}

function checkUsername() {

    if (!/^[a-zA-Z0-9_]{1,15}$/.test(usernameInput.value)) {
        usernameError.textContent = "Sono ammesse lettere, numeri e underscore. Max. 15";
        usernameInput.parentNode.parentNode.classList.add('error');
        usernameError.classList.add("errorSpan");
    } else {
        usernameInput.parentNode.parentNode.classList.remove('error');
        usernameError.classList.remove("errorSpan");
        fetch("../api/checkUsername.php?q=" + encodeURIComponent(usernameInput.value) + "&id=" + user).then(fetchResponse).then(jsonCheckUsername);
    }
}

function checkEmail(event) {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(emailInput.value).toLowerCase())) {
        emailError.textContent = "Email non valida";
        emailInput.parentNode.parentNode.classList.add('error');
        emailError.classList.add("errorSpan")
    } else {
        emailInput.parentNode.parentNode.classList.remove('error');
        emailError.classList.remove("errorSpan");
        fetch("../api/checkEmail.php?q=" + encodeURIComponent(String(emailInput.value).toLowerCase()) + "&id=" + user).then(fetchResponse).then(jsonCheckEmail);
    }
}

let username = ""

function jsonCheckUsername(json) {
    // Controllo il campo exists ritornato dal JSON
    if (!json.isMine) {
        if (!json.exists) {
            usernameInput.parentNode.parentNode.classList.remove('error');
            usernameError.classList.remove("errorSpan");
            fetch("../api/updateProfile.php?id=" + user + "&Username=" + usernameInput.value);

            document.querySelector(".username").textContent = usernameInput.value;
        } else {
            usernameError.textContent = "Nome utente già utilizzato";
            usernameInput.parentNode.parentNode.classList.add('error');
            usernameError.classList.add("errorSpan")
        }
    } else {
        usernameInput.parentNode.parentNode.classList.remove('error');
        usernameError.classList.remove("errorSpan");
    }
}

function jsonCheckEmail(json) {
    // Controllo il campo exists ritornato dal JSON
    if (!json.isMine) {
        if (!json.exists) {
            emailInput.parentNode.parentNode.classList.remove('error');
            emailError.classList.remove("errorSpan");
            if (confirm("Verrai scollegato, vuoi continuare?")) {
                fetch("../api/updateProfile.php?id=" + user + "&Email=" + emailInput.value);
                window.location.href = '../logout.php';
            }
        } else {
            emailError.textContent = "Email già utilizzata";
            emailInput.parentNode.parentNode.classList.add('error');
            emailError.classList.add("errorSpan");
        }
    } else {
        emailInput.parentNode.parentNode.classList.remove('error');
        emailError.classList.remove("errorSpan");
    }
}


const usernameInput = document.querySelector('#usernameBar input')
const emailInput = document.querySelector('#emailBar input')

const usernameError = document.querySelector('#usernameError')
const emailError = document.querySelector('#emailError')

usernameInput.addEventListener('blur', checkUsername);
emailInput.addEventListener('blur', checkEmail);