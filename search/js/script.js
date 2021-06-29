//Funzione per importare le repositories con la creazione degli elementi (createElement) e l'aggiunta al rispettivo div #contents (appendChild)
function importRepos(contents) {
    console.log(contents);
    checkAllElements(contents);
    //Dichiarazione delle variabili
    let id, card, lockImage, externalLinkImage, externalLinkButton, name, textName, languageImage, description, textDescriptionValue
        //For per tutti gli elementi presenti nei contenuti
    for (let content of contents) {
        //Se la repository presenta contenuti verrà mostrata
        if (content.size !== 0) {
            //Inizializzo l'id 'calcolandomelo'
            id = 'card' + contents.indexOf(content);

            //Creazione del div che conterrà tutti i valori dell'elemento
            card = document.createElement('div');
            card.setAttribute('class', 'card centered');
            card.setAttribute('id', id);

            //Creazione del pulsante che mi permetterà di selezionare la repository
            button = document.createElement("a")
            button.setAttribute('class', 'selectable');
            button.setAttribute('href', '../project?q=' + content.Nome)
                //button.addEventListener("click", selectProject);


            //Creazione del div contenente l'immagine principale
            imageDiv = document.createElement('div');
            imageDiv.setAttribute('class', 'mainImage centered');
            image = document.createElement('img');
            image.setAttribute('src', content.Logo);
            imageDiv.appendChild(image)

            //Creazione del tag h2 contenente il nome 
            name = document.createElement('h2');
            textName = document.createTextNode(content.Nome);
            name.appendChild(textName);


            //Se è presente la descrizione la inserisce e regola la distanza dal titolo meiante una classe
            if (content.Descrizione !== "") {
                description = document.createElement('p');
                textDescriptionValue = document.createTextNode(content.Descrizione);
                description.appendChild(textDescriptionValue);
                name.setAttribute("class", "description")
            }

            //Aggiunta degli elementi creati al pulsante al div card
            button.appendChild(imageDiv);
            button.appendChild(name);
            if (content.description !== "") button.appendChild(description);
            card.appendChild(button)

            //Aggiunta del div card alla sezione
            contentsDiv.appendChild(card);
        }
    }
}

//Funzione per mostrare o meno il div #notify
function showNotify(type) {
    //Mostra il div #notify e nascondi il div #contents
    contentsDiv.classList.add(nameClassHide);
    notifyDiv.classList.remove(nameClassHide);

    //In base al tipo di notifica setto il titolo, il sottotitolo e la classe
    notifyDiv.querySelector('h1').textContent = notifyData[type].title;
    notifyDiv.querySelector('p').textContent = notifyData[type].subtitle;
    notifyDiv.setAttribute("class", notifyData[type].class);
}



//Funzione per il controllo della visibilità di tutti gl elementi
function checkAllElements(contents) {
    if (contents.length > 0) {
        notifyDiv.classList.add(nameClassHide);
        contentsDiv.classList.remove(nameClassHide);
    } else showNotify("noSearch");
}

function onJson(json) {
    importRepos(json);
}


//Funzione per passare la risposta JSON
function onResponse(response) {
    return response.json();
}

//Funzione che mostra la notifica 
function onError() {
    showNotify("error")
}

function search(event) {
    event.preventDefault();
    if (searchInput.value !== "") {
        window.history.pushState("", "", "?q=" + searchInput.value);
        contentsDiv.innerHTML = ""
        fetch("../api/projects.php?q=" + searchInput.value).then(onResponse, onError).then(onJson).catch(onError)
    }
}
//Dichiarazione e inizializzazione delle constanti delle sezioni
const notifyDiv = document.querySelector('#notify');
const contentsDiv = document.querySelector('#contents');

const searchButton = document.querySelector("#searchButton");
const searchInput = document.querySelector("#searchProjectsBar #text");

searchButton.addEventListener("click", search)
searchButton.addEventListener("keyup", search)

//Nome della classe per la gestione della visibilità
const nameClassHide = "hidden";

//Richiesta dei dati utente di chi ha fatto l'accesso
fetch("../api/projects.php?q=" + getValueFromURL("q")).then(onResponse, onError).then(onJson).catch(onError)