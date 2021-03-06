//Funzione per aggiungere un elemento ai selezionati
function addToSelection(event) {
    //Dichiarazione delle variabili
    let card, image, subButton, textSubButton, name, textName

    //Creazione di un div card con data-id pari all'id della card da dove √® stato cliccato il pulsante
    card = document.createElement('div');
    card.setAttribute('class', 'card');
    card.setAttribute('data-id', event.currentTarget.parentNode.id);

    //Creazione dell'immagine con sorgente pari a quella del nodo dal quale proviene
    image = document.createElement('img');
    image.setAttribute('src', event.currentTarget.parentNode.querySelector('.mainImage').src);

    //Creazione del pulsante per la rimozione dai selezionati
    subButton = document.createElement('a');
    subButton.setAttribute('class', 'subButton');
    textSubButton = document.createTextNode('-');
    subButton.appendChild(textSubButton);
    subButton.addEventListener('click', removeFromSelection);

    //Creazione di un h4 con testo uguale al nodo dal quale proviene
    name = document.createElement('h4');
    textName = document.createTextNode(event.currentTarget.parentNode.querySelector('h2').textContent);
    name.appendChild(textName);

    //Aggiunta degli elementi al div card
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(subButton);

    //Settaggio della visibilit√† nel dictionary con tutti gli elementi
    allContentsDisplay[event.currentTarget.parentNode.id] = false;

    //Aggiunta del div card ai selezionati
    selectedDiv.appendChild(card);

    //Eseguo il controllo per mostrare o non mostrare gli elementi
    checkAllElements();
}

//Funzione per la rimozione dell'elemento
function removeFromSelection(event) {
    //Settaggio della visibilit√† nel dictionary con tutti gli elementi
    allContentsDisplay[event.currentTarget.parentNode.dataset.id] = true;

    //Rimozione dell'elemento dai selezionati
    selectedDiv.removeChild(event.currentTarget.parentNode);

    //Eseguo il controllo per mostrare o non mostrare gli elementi
    checkAllElements();
}

//Funzione per verificare che tutti gli elementi tra due dictionary siano uguali e pari ad un terzo valore passato
function compareDictionariesValues(firstDictionary, secondDictionary, value) {
    if (Object.keys(firstDictionary).length === Object.keys(secondDictionary).length && Object.keys(firstDictionary).length > 0) {
        for (a in firstDictionary) {
            if (firstDictionary[a] !== value && firstDictionary[a] === secondDictionary[a]) return false;
        }
    }
    return true
}

//Funzione per mostrare o meno il div #notify
function showNotify(type) {
    //Mostra il div #notify e nascondi il div #deploy .cards
    contentsDiv.classList.add(nameClassHide);
    notifyDiv.classList.remove(nameClassHide);

    //In base al tipo di notifica setto il titolo, il sottotitolo e la classe
    notifyDiv.querySelector('h2').textContent = notifyData[type].title;
    notifyDiv.querySelector('p').textContent = notifyData[type].subtitle;
    notifyDiv.setAttribute("class", notifyData[type].class);
}

//Funzione per mostrare o nascondere la descrizione
function toggleDescription(event) {
    //Dichiarazione delle costanti
    const showMoreText = event.currentTarget.parentNode.querySelector('p');
    const button = event.currentTarget.parentNode.querySelector('.showButton b');

    //Se non visibile lo mostra e viceversa
    if (showMoreText.classList.contains(nameClassHide)) {
        showMoreText.classList.remove(nameClassHide)
        button.textContent = 'Show less';
    } else {
        showMoreText.classList.add(nameClassHide);
        button.textContent = 'Show more';
    }

    //Controlla la visibilit√† di tutti gli elementi
    checkAllElements()
}

//Funzione per controllare se sono visibili pi√Ļ di un massimo numero di descrizioni
function areVisibleManyDescriptions(max) {
    //Richiamo i div contenenti le descrizioni e quelli nascosti
    let cards = contentsDiv.querySelectorAll(".card")
    let hiddenCards = contentsDiv.querySelectorAll(".card.hidden")
    let showMoreButtons = contentsDiv.querySelectorAll(".card .showButton")

    //Se sono presenti pi√Ļ div del numero massimo passato
    if (hiddenCards.length < max && cards.length > max && showMoreButtons.length > 0) {
        //E se esiste almeno un div visibile con descrizione non visibile ritorna falso
        for (let c of cards) {
            if (!c.classList.contains(nameClassHide) && c.querySelector("p").classList.contains(nameClassHide)) return false
        }
    } else return false

    //Altrimenti sar√† vero
    return true
}

//Funzione per il controllo della visibilit√† di tutti gl elementi
function checkAllElements() {
    //For tra il dictionary contenente la visibilit√† di tutti i contenuti
    for (let a in allContentsDisplay) {
        //Se visibili e non filtrati devono vedersi, altrimenti no
        if (allContentsDisplay[a] && filteredContentsDisplay[a]) document.querySelector('#' + a).classList.remove(nameClassHide)
        else document.querySelector('#' + a).classList.add(nameClassHide);
    }

    //Se tutti gli elementi sono visibili mostra la sezione che contiente quelli selezionati altrimenti non la mostra
    let areSelectedContents = (selectedDiv.querySelectorAll(".card").length > 0)
    if (areSelectedContents) selectedSection.classList.remove(nameClassHide);
    else selectedSection.classList.add(nameClassHide);

    //Controllo della visibilit√† dell'EasterEgg
    if (areVisibleManyDescriptions(3)) easterEgg.classList.remove(nameClassHide)
    else easterEgg.classList.add(nameClassHide)

    //Controllo della visibili√† degli elementi dai dictionary
    let areHiddenAllFiltered = compareDictionariesValues(filteredContentsDisplay, filteredContentsDisplay, false);
    let areHiddenAll = compareDictionariesValues(allContentsDisplay, filteredContentsDisplay, false);
    let areHiddenAllContents = compareDictionariesValues(allContentsDisplay, allContentsDisplay, false);

    //Gestione della visibilit√† e del tipo del div #notify
    let typeNotice = 'filter';
    if (areHiddenAllContents) {
        typeNotice = 'empty';
        stepsBar.classList.add(nameClassHide)
        contentsDiv.parentNode.parentNode.style.width = "100%"
        searchBar.parentNode.classList.add(nameClassHide);
    } else {
        stepsBar.classList.remove(nameClassHide)
        contentsDiv.parentNode.parentNode.style.width = "90%"
        searchBar.parentNode.classList.remove(nameClassHide);
    }

    let noticeVisible = areHiddenAllFiltered || areHiddenAll;
    if (noticeVisible) showNotify(typeNotice);
    else {
        notifyDiv.classList.add(nameClassHide);
        contentsDiv.classList.remove(nameClassHide);
    }
}

//Funzione per la ricerca
function search(event) {
    //Dichiarazioni delle varibaili
    let name, id;
    const filter = event.currentTarget.value.toUpperCase().trim();
    const cards = contentsDiv.querySelectorAll('.card');

    //For che scansiona gli elementi presenti
    for (let card of cards) {
        name = card.querySelector('h2').textContent;
        id = card.id;

        //Se il nome √® uguale al valore inserito nella barra di ricerca lo mantiene altrimenti lo nasconde
        filteredContentsDisplay[id] = (name.toUpperCase().indexOf(filter) > -1);

        //Controllo della visbilit√† degli elementi
        checkAllElements();
    }
}

//Creo la barra che indica i progessi
function createBar() {
    //Dichiao le variabili e setto l'indice pari a 1
    let progressStep, stepCount, textCount, stepDescription, textDescription;
    let index = 1

    //In base a quante azioni ho sul mio dizionario inserisco step
    for (let step in actionStep) {
        //Creo il pulsante che conterr√† il titolo e il numero della pagina, in grado di farmi tornare indiero se cliccato
        progressStep = document.createElement("a")
        progressStep.setAttribute("class", "progressStep")
        progressStep.addEventListener("click", stepClick)

        //Creo il div che conterr√† il numero
        stepCount = document.createElement("div")
        stepCount.setAttribute("class", "stepCount");
        textCount = document.createTextNode(index)
        stepCount.appendChild(textCount);

        //Creo il titolo 
        stepDescription = document.createElement("h3");
        stepDescription.setAttribute("class", "stepDescription")
        textDescription = document.createTextNode(step);
        stepDescription.appendChild(textDescription);

        //Inserisco il tutto al mio a padre e alla barra di progresso
        progressStep.appendChild(stepCount);
        progressStep.appendChild(stepDescription);
        stepsBar.appendChild(progressStep);

        //Passo avanti il mio indice
        index++;
    }
}
//Se lo step viene cliccato
function stepClick(event) {
    //Passa alla relativa pagina solo se precendente
    let number = parseInt(event.currentTarget.querySelector(".stepCount").textContent)
    if (number < pageNumber) {
        pageNumber = number;
        setPage(number)
    }
}

//Resetto tutti gli elementi della mia pagina e la preparo per la visulazziazione della prossima
function reset(contents) {
    //Resetto la barra di ricerca e imposto il placeholder con un valore random dei miei contenuti se passati
    searchBarInput.value = ""
    if (contents) {
        if (contents.length > 0) searchBarInput.setAttribute("placeholder", "e.g. " + contents[Math.floor(Math.random() * contents.length)].Nome)
    }
    //Resetto gli array associativi che mi gestiscono la visibilit√†
    allContentsDisplay = {}
    filteredContentsDisplay = {}

    //Rimuovo tutti i div degli elementi mostrati
    let cards = contentsDiv.querySelectorAll(".card")
    for (let c of cards) {
        contentsDiv.removeChild(c)
    }

    //Rimuovo tutti i div degli elementi mostrati
    let selectedCards = selectedDiv.querySelectorAll(".card")
    for (let selectedCard of selectedCards) {
        selectedDiv.removeChild(selectedCard)
    }

    //Controllo la visibilit√† di tutti gli elementi
    checkAllElements()
}

//Passo i valori degli elementi selezionati al mio array di uscita
function addSBCToArray() {
    let selectedCards = selectedDiv.querySelectorAll(".card")
    let arraySBC = []
    for (let selectedCard of selectedCards) {
        arraySBC.push(selectedCard.querySelector("h4").textContent)
    }
    next(arraySBC)
}

//Vado alla pagina successiva mettendo nell'array di uscita il valore passato 
function next(value) {
    outuputSelection[pageNumber - 1] = value;
    if (pageNumber < Object.keys(actionStep).length) {
        pageNumber++
        setPage(pageNumber)
    }
}

//Vado alla pagina richiesta
function setPage(number) {
    //Setto le classi per gli step della mia barra
    progressSteps[number - 1].classList.add("active");
    progressSteps[number - 1].classList.add("now")
    for (let s = 0; s < number - 1; s++) {
        progressSteps[s].classList.remove("now");
    }
    for (let s = number; s < progressSteps.length; s++) {
        progressSteps[s].classList.remove("active");
        progressSteps[s].classList.remove("now");
    }

    //Inizializzo un valore nullo nel mio array di uscita per questa nuova pagina
    outuputSelection[number - 1] = ""

    //Richiamo la funzione richiesta per visualizzare il mio step
    let k = progressSteps[number - 1].querySelector(".stepDescription")
    actionStep[k.textContent]()
}

//Funzione per passare la risposta JSON
function onResponse(response) {
    return response.json();
}

//Funzione che mostra la notifica 
function onError() {
    showNotify("error")
}

//Funzione per elaborare il JSON dell'utente in risposta della mia fetch GitHub 
function onJsonUser(json) {
    if (json.login) {
        //Richiamo il div che conterr√† le informazioni dell'utente
        let profile = document.querySelector("#profile");

        //Creo l'immagine che mostrer√† il relativo avatar
        let imageProfile = document.createElement("img");
        imageProfile.setAttribute("src", json.avatar_url);
        imageProfile.setAttribute("height", "50");
        imageProfile.setAttribute("width", "50");
        profile.appendChild(imageProfile)

        //Creo il paragrafo che conterr√† il nome utente
        let username = document.createElement("p");
        let usernameText = document.createTextNode("@" + json.login)
        username.appendChild(usernameText);

        //Rendo visibile il div che mostr√† le informazioni del profilo
        profile.appendChild(username);
        profile.classList.remove(nameClassHide)

        //Setto la mia variabile username con quella presente nel JSON
        GitHubUsername = json.login
    }
}

//Dichiarazione e inizializzazione delle constanti delle sezioni
const notifyDiv = document.querySelector('#notify');
const contentsDiv = document.querySelector('#Deploy .main.cards');

//Dichiarazione e inizializzazione barra di ricerca con event listener che richiama la funzione search
const searchBar = document.querySelector('#searchContentsBar');
const searchBarInput = searchBar.querySelector('input');
searchBarInput.addEventListener('keyup', search);

//Dichiarazione e inizializzazione della sezione  ove saranno presenti gli elementi selezionati e il rispettivo contenitore
const selectedSection = document.querySelector('#selected')
const selectedDiv = selectedSection.querySelector('.cards');

//Dictionary per la gestione della visibilit√† di tutti gli elementi e degli stessi se filtrati
let allContentsDisplay = {};
let filteredContentsDisplay = {};

//Gestione dell'EasterEgg con la visibilit√† delle descrizione
const easterEgg = document.querySelector('#easterEgg');

//Dichiarazione e inizializzazione della variabile per la gestione del pulsante per andare alla prossima pagina
let selectNext = document.querySelector("#selectedNext");
selectNext.addEventListener("click", addSBCToArray)

//Nome della classe per la gestione della visibilit√†
const nameClassHide = "hidden";

//Varibiali GitHub per il token Oauth 2.0 e l'username dell'utente che ha fatto l'accesso
let GitHubToken = localStorage.getItem("GitHubToken")
let GitHubUsername = ""

//Array di uscita dei valori selezionati tra le pagine
let outuputSelection = []

//Array associativo tra i nomi delle pagine da mostrare e le funzioni per mostrare le relative pagine
const actionStep = {
    "Project": getRepos,
    "SBC": chargeSBCs,
    "Deploy": sendEmails
}

//Creazione della barra e settare la pagina corrente
const stepsBar = document.querySelector("#stepsBar");
createBar()
const progressSteps = stepsBar.querySelectorAll(".progressStep")
let pageNumber = 1;
setPage(pageNumber)