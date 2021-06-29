function switchAction(event) {
    let type = "";
    if (emailbar.classList.contains("hidden")) type = "signup";
    else type = "login";

    switchForm(type);
    window.history.pushState("", "", "?q=" + type);
}

function jsonCheckUsername(json) {
    // Controllo il campo exists ritornato dal JSON
    if (formStatus.username = !json.exists) {
        document.querySelector('.username').classList.remove('error');
        usernameInput.parentNode.parentNode.classList.remove('error');
        usernameError.classList.remove("errorSpan");
    } else {
        usernameError.textContent = "Nome utente già utilizzato";
        usernameInput.parentNode.parentNode.classList.add('error');
        usernameError.classList.add("errorSpan")
    }
    checkForm();
}

function jsonCheckEmail(json) {
    // Controllo il campo exists ritornato dal JSON
    if (formStatus.email = !json.exists) {
        emailInput.parentNode.parentNode.classList.remove('error');
        emailError.classList.remove("errorSpan");
    } else {
        emailError.textContent = "Email già utilizzata";
        emailInput.parentNode.parentNode.classList.add('error');
        emailError.classList.add("errorSpan");
    }
    checkForm();
}

function fetchResponse(response) {
    if (!response.ok) return null;
    return response.json();
}

function checkUsername(event) {

    if (!/^[a-zA-Z0-9_]{1,15}$/.test(usernameInput.value)) {
        usernameError.textContent = "Sono ammesse lettere, numeri e underscore. Max. 15";
        usernameInput.parentNode.parentNode.classList.add('error');
        usernameError.classList.add("errorSpan");
        formStatus.username = false;
        checkForm();
    } else {
        usernameInput.parentNode.parentNode.classList.remove('error');
        usernameError.classList.remove("errorSpan");
        fetch("../api/checkUsername.php?q=" + encodeURIComponent(usernameInput.value)).then(fetchResponse).then(jsonCheckUsername);
    }
}

function checkEmail(event) {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(emailInput.value).toLowerCase())) {
        emailError.textContent = "Email non valida";
        emailInput.parentNode.parentNode.classList.add('error');
        emailError.classList.add("errorSpan")
        formStatus.email = false;
        checkForm();
    } else {
        emailInput.parentNode.parentNode.classList.remove('error');
        emailError.classList.remove("errorSpan");
        fetch("../api/checkEmail.php?q=" + encodeURIComponent(String(emailInput.value).toLowerCase())).then(fetchResponse).then(jsonCheckEmail);
    }
}

function checkPassword(event) {
    if (formStatus.password = passwordInput.value.length >= 8) {
        passwordInput.parentNode.parentNode.classList.remove('error');
        passwordError.classList.remove("errorSpan")
    } else {
        passwordInput.parentNode.parentNode.classList.add('error');
        passwordError.classList.add("errorSpan")
    }
    checkForm();
}

function checkConfirmPassword(event) {
    if (formStatus.confirmPassord = confirmPasswordInput.value === passwordInput.value) {
        confirmPasswordInput.parentNode.parentNode.classList.remove('error');
        confirmPasswordError.classList.remove("errorSpan")
    } else {
        confirmPasswordInput.parentNode.parentNode.classList.add('error');
        confirmPasswordError.classList.add("errorSpan")
    }
    checkForm();
}

function checkForm() {
    // Controlla consenso dati personali
    submitButton.disabled = !allowInput.checked ||
        // Controlla che tutti i campi siano pieni
        Object.keys(formStatus).length !== 4 ||
        // Controlla che i campi non siano false
        Object.values(formStatus).includes(false);
}

const formStatus = {};
/*document.querySelector('.name').addEventListener('blur', checkName);
document.querySelector('.surname').addEventListener('blur', checkName);*/


if (document.querySelector('.error') !== null) {
    checkUsername();
    checkPassword();
    checkConfirmPassword();
    checkEmail();
}

function switchForm(type) {
    if (type === "login") {
        emailbar.classList.add("hidden");
        confirmPasswordBar.classList.add("hidden");
        titleForm.textContent = "Log in to your account"
        submitButton.value = "Login";

        usernameInput.parentNode.parentNode.classList.remove('error');
        usernameError.classList.remove("errorSpan");
        passwordInput.parentNode.parentNode.classList.remove('error');
        passwordError.classList.remove("errorSpan");

        usernameInput.removeEventListener('blur', checkUsername);
        emailInput.removeEventListener('blur', checkEmail);
        passwordInput.removeEventListener('blur', checkPassword);
        confirmPasswordInput.removeEventListener('blur', checkConfirmPassword);
        allowInput.removeEventListener('change', checkForm);

        emailInput.value = "";
        confirmPasswordInput.value = "";
        submitButton.disabled = false;
        checkBoxLabel.textContent = "Ricorda l'accesso"

        switchButton.querySelector("b").textContent = "Create!"
        switchText.textContent = "Don't have an account?"

        for (let spanError of spanErrors) {
            if (spanError.id !== "postSpan")
                spanError.classList.add("hidden")
        }
        for (let br of brs) {
            br.classList.remove("hidden")
        }
    } else if (type === "signup") {
        emailbar.classList.remove("hidden");
        confirmPasswordBar.classList.remove("hidden");
        titleForm.textContent = "Sign up and experience Grapes Mi today"
        submitButton.value = "Signup";

        usernameInput.addEventListener('blur', checkUsername);
        emailInput.addEventListener('blur', checkEmail);
        passwordInput.addEventListener('blur', checkPassword);
        confirmPasswordInput.addEventListener('blur', checkConfirmPassword);
        allowInput.addEventListener('change', checkForm);

        submitButton.disabled = true;
        checkBoxLabel.textContent = "Acconsento al furto dei dati personali";

        switchButton.querySelector("b").textContent = "Login!"
        switchText.textContent = "Already have an account?"

        if (usernameInput.value.trim() !== "") checkUsername();
        if (passwordInput.value.trim() !== "") checkPassword();
        if (confirmPasswordInput.value.trim() !== "") checkConfirmPassword();
        if (emailInput.value.trim() !== "") checkEmail();

        for (let spanError of spanErrors) {
            spanError.classList.remove("hidden")
        }
        for (let br of brs) {
            br.classList.add("hidden")
        }
    }
}

function loading(event) {
    let img = event.currentTarget.querySelector("img");
    img.src = "../img/icon/loading.gif"
    img.classList.add("loading")
}
if (document.querySelector('.error') !== null) {
    checkUsername();
    checkPassword();
    checkConfirmPassword();
    checkEmail();
}

const emailbar = document.querySelector("#emailBar");
const confirmPasswordBar = document.querySelector("#confirmPasswordBar");
const submitButton = document.querySelector("#submit");
const titleForm = document.querySelector(".title h2");

const usernameInput = document.querySelector('.username input')
const emailInput = document.querySelector('.email input')
const passwordInput = document.querySelector('.password input')
const confirmPasswordInput = document.querySelector('.confirmPassword input')
const allowInput = document.querySelector('.allow input')

usernameInput.addEventListener('blur', checkUsername);
emailInput.addEventListener('blur', checkEmail);
passwordInput.addEventListener('blur', checkPassword);
confirmPasswordInput.addEventListener('blur', checkConfirmPassword);
allowInput.addEventListener('change', checkForm);

const spanErrors = document.querySelectorAll("span")
const brs = document.querySelectorAll("br")

const usernameError = document.querySelector('#usernameError')
const emailError = document.querySelector('#emailError')
const passwordError = document.querySelector('#passwordError')
const confirmPasswordError = document.querySelector('#confirmPasswordError')

const checkBoxLabel = document.querySelector("label[for='allow']")

const switchButton = document.querySelector('#switch a');
const switchText = document.querySelector('#switch p');

switchButton.addEventListener('click', switchAction);

const githubButton = document.querySelector("#github");
githubButton.addEventListener("click", loading)

switchForm(getValueFromURL("q"));