//Funzione per importare le repositories con la creazione degli elementi (createElement) e l'aggiunta al rispettivo div #deploy .cards (appendChild)
/*function importRepos(contents) {
    //Dichiarazione delle variabili
    let id, card, lockImage, externalLinkImage, externalLinkButton, name, textName, languageImage, description, textDescriptionValue
        //For per tutti gli elementi presenti nei contenuti
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
            button.addEventListener("click", selectProject);

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
                languageImage.setAttribute('src', languageImages[content.language]);
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
            contentsDiv.appendChild(card);
        }
    }
}*/

function importRepos(contents) {
    //Dichiarazione delle variabili
    let id, card, imageDiv, image, externalLinkButton, name, textName, languageImage, description, textDescriptionValue
        //For per tutti gli elementi presenti nei contenuti
    for (let content of contents) {
        //Se la repository presenta contenuti verrà mostrata
        if (content.size !== 0) {
            //Inizializzo l'id 'calcolandomelo'
            id = 'card' + contents.indexOf(content);

            //Inizializzazione dei valori nei dictionary per la gestione della visibilità mentre sono filtrati e non
            allContentsDisplay[id] = filteredContentsDisplay[id] = true;

            //Creazione del div che conterrà tutti i valori dell'elemento
            card = document.createElement('div');
            card.setAttribute('class', 'card centered');
            card.setAttribute('id', id);

            //Creazione del div contenente l'immagine principale
            imageDiv = document.createElement('div');
            imageDiv.setAttribute('class', 'mainImage centered');
            image = document.createElement('img');
            image.setAttribute('src', content.Logo);
            imageDiv.appendChild(image);

            //Creazione del pulsante che mi permetterà di selezionare la repository
            button = document.createElement("a")
            button.setAttribute('class', 'selectable');
            button.addEventListener("click", selectProject);

            //Creazione del tag h2 contenente il nome 
            name = document.createElement('h2');
            textName = document.createTextNode(content.Nome);
            name.appendChild(textName);

            //Se vi è il linguaggio di programmazzione principale utilizzato mostra la relativa imagine
            if (content.language !== null) {
                languageImage = document.createElement('img');
                languageImage.setAttribute('class', 'item rightTop')
            }

            //Se è presente la descrizione la inserisce e regola la distanza dal titolo meiante una classe

            if (content.Descrizione) {
                description = document.createElement('p');
                textDescriptionValue = document.createTextNode(content.Descrizione);
                description.appendChild(textDescriptionValue);
                name.setAttribute("class", "description")
            }

            //Aggiunta degli elementi creati al pulsante al div card
            button.appendChild(imageDiv)
            button.appendChild(name);
            if (content.language) card.appendChild(languageImage);
            if (content.Descrizione) button.appendChild(description);
            card.appendChild(button)

            //Aggiunta del div card alla sezione
            contentsDiv.appendChild(card);
        }
    }
}

//Quando viene selezionato un progetto
function selectProject(event) {
    //Sali a inizio pagina
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    //Passa alla prossima pagina
    next(event.currentTarget.querySelector("h2").textContent)
}

//Funzione per la gestione del JSON ritornato con le repositories
function onJsonProjects(json) {
    reset(json)
    importRepos(json)
    checkAllElements()
}

function getRepos() {
    fetch("../api/collaboration.php?id=" + user).then(onResponse).then(onJsonProjects)
}


/*function getRepos() {
    reset(data)
    importRepos(data)
    checkAllElements()
    console.log(data)
}*/