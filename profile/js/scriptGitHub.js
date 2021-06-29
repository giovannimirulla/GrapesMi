//Funzione per importare le repositories con la creazione degli elementi (createElement) e l'aggiunta al rispettivo div #deploy .cards (appendChild)
function importGitHub(contents) {
    //Dichiarazione delle variabili
    let id, card, lockImage, externalLinkImage, externalLinkButton, name, textName, languageImage, description, textDescriptionValue
        //For per tutti gli elementi presenti nei contenuti
    if (contents.length > 0) {
        for (let content of contents) {
            //Se la repository presenta contenuti verrà mostrata
            if (content.size !== 0) {
                //Inizializzo l'id 'calcolandomelo'
                id = 'card' + contents.indexOf(content);

                //Inizializzazione dei valori nei dictionary per la gestione della visibilità mentre sono filtrati e non
                allContentsDisplay[id] = filteredContentsDisplay[id] = true;

                //Creazione del div che conterrà tutti i valori dell'elemento
                card = document.createElement('div');
                card.setAttribute('class', 'card centered noImage');
                card.setAttribute('id', id);

                //Creazione del pulsante che mi permetterà di selezionare la repository
                button = document.createElement("a")
                button.setAttribute('class', 'selectable');
                button.addEventListener("click", selectRepo);

                //Immagine che visualizzerà se la repositoy è privata o meno
                lockImage = document.createElement("img");
                lockImage.setAttribute("class", "item leftTop");
                if (content.private) lockImage.setAttribute("src", "../img/icon/lock.svg");
                else lockImage.setAttribute("src", "../img/icon/unlock.svg");

                //Creazione del tag h2 contenente il nome 
                name = document.createElement('h2');
                textName = document.createTextNode(content.name);
                name.appendChild(textName);

                //Se vi è il linguaggio di programmazzione principale utilizzato mostra la relativa imagine
                if (content.language !== null) {
                    languageImage = document.createElement('img');
                    languageImage.setAttribute('class', 'item rightTop')

                    if (languageImages[content.language] !== null) languageImage.setAttribute('src', languageImages[content.language].replace("{background}", "f5f6f7"));

                }

                //Se è presente la descrizione la inserisce e regola la distanza dal titolo meiante una classe
                if (content.description) {
                    description = document.createElement('p');
                    textDescriptionValue = document.createTextNode(content.description);
                    description.appendChild(textDescriptionValue);
                    name.setAttribute("class", "description")
                }

                //Mostra un pulsante che manda al link esterno della repository su GitHub
                externalLinkButton = document.createElement("a")
                externalLinkButton.setAttribute("href", content.html_url)
                externalLinkImage = document.createElement("img")
                externalLinkButton.setAttribute("class", "item rightBottom")
                externalLinkImage.setAttribute("src", "../img/icon/external-link-symbol.svg")
                externalLinkButton.appendChild(externalLinkImage)
                card.appendChild(externalLinkButton)

                //Aggiunta degli elementi creati al pulsante al div card
                card.appendChild(lockImage);
                button.appendChild(name);
                if (content.language) card.appendChild(languageImage);
                if (content.description) button.appendChild(description);
                card.appendChild(button)

                //Aggiunta del div card alla sezione
                githubDiv.appendChild(card);
            }
        }
    }
}

//importGitHub()

const githubDiv = document.querySelector('#New-project .main.cards');

function onErrorRepos(e) {
    console.log(e)
}

function onResponseRepos(response) {
    return response.json();
}

function onJsonRepos(json) {
    importGitHub(json)
}

function selectRepo(event) {
    let name = event.currentTarget.querySelector("h2").textContent;
    let description = ""
    let descriptionElement = event.currentTarget.querySelector("p");
    if (descriptionElement) description = descriptionElement.textContent;
    inputProjectName.value = name;
    inputProjectDescription.textContent = description

    gitHubButton.classList.remove("close")
    gitHubButton.querySelector("img").src = "../img/icon/github.svg"
    let p = document.createElement("p")
    p.textContent = "...with GitHub"
    gitHubButton.appendChild(p)
    reposDiv.classList.add("hidden")
    formProject.classList.remove("hidden")

    checkProject()
}

function showGitHub(event) {
    //event.currentTarget.classList.add("hidden")
    if (reposDiv.classList.contains("hidden")) {
        event.currentTarget.classList.add("close")
        event.currentTarget.removeChild(event.currentTarget.querySelector("p"))
        event.currentTarget.querySelector("img").src = "../img/icon/close.svg"
        reposDiv.classList.remove("hidden")
        formProject.classList.add("hidden")
    } else {
        event.currentTarget.classList.remove("close")
        event.currentTarget.querySelector("img").src = "../img/icon/github.svg"
        let p = document.createElement("p")
        p.textContent = "...with GitHub"
        event.currentTarget.appendChild(p)
        reposDiv.classList.add("hidden")
        formProject.classList.remove("hidden")
    }
}


function checkProject() {
    if (!/^[a-zA-Z0-9_-]{0,23}$/.test(inputProjectName.value)) {
        nameProjectError.textContent = "Sono ammesse lettere, numeri e underscore. Max. 23";
        inputProjectName.parentNode.parentNode.classList.add('error');
        nameProjectError.classList.add("errorSpan");
    } else {
        inputProjectName.parentNode.parentNode.classList.remove('error');
        nameProjectError.classList.remove("errorSpan");
        fetch("../api/checkProject.php?q=" + encodeURIComponent(inputProjectName.value)).then(fetchResponse).then(jsonCheckProject);
    }

}

function jsonCheckProject(json) {
    // Controllo il campo exists ritornato dal JSON
    if (!json.exists) {
        inputProjectName.parentNode.parentNode.classList.remove('error');
        nameProjectError.classList.remove("errorSpan");
    } else {
        nameProjectError.textContent = "Nome progetto già utilizzato";
        inputProjectName.parentNode.parentNode.classList.add('error');
        nameProjectError.classList.add("errorSpan")
    }
}
const gitHubButton = document.querySelector("#github")
if (token === "") gitHubButton.classList.add("hidden")
else gitHubButton.addEventListener("click", showGitHub)

const nameProjectError = document.querySelector("#nameProjectError")

const reposDiv = document.querySelector("#New-project .cards")
const formProject = document.querySelector("#New-project form")

const inputProjectName = document.querySelector("#nameProjectBar input")
inputProjectName.addEventListener("blur", checkProject)
const inputProjectDescription = document.querySelector("#descriprionProjectArea textarea")

fetch("../api/githubRepos.php?token=" + token).then(onResponseRepos, onErrorRepos).then(onJsonRepos).catch(onErrorRepos)