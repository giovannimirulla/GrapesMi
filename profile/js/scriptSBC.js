//Funzione per importare i contenuti con la creazione degli elementi (createElement) e l'aggiunta al rispettivo div #deploy .cards (appendChild)
function importSBCs(json) {
    //Dichiarazione delle variabili
    let id, card, addButton, imageDiv, image, name, textName, divOS, imageOS, showButton, boldTextShowButton, textShowButton, description, boldTextDescriptionKey, textDescriptionKey, textDescriptionValue, br
        //For per tutti gli elementi presenti nei contenuti
    for (let sbc of json) {
        //Inizializzo l'id 'calcolandomelo'
        id = 'card' + json.indexOf(sbc);

        //Inizializzazione dei valori nei dictionary per la gestione della visibilità mentre sono filtrati e non
        allContentsDisplay[id] = filteredContentsDisplay[id] = true;

        //Creazione del div che conterrà tutti i valori dell'elemento
        card = document.createElement('div');
        card.setAttribute('class', 'card sbc centered');
        card.setAttribute('id', id);

        //Creazione del pulsante per l'aggiunta ai selezionati
        addButton = document.createElement('a');
        addButton.setAttribute('class', 'addButton item rightTop');
        textAddButton = document.createTextNode('+');
        addButton.appendChild(textAddButton);
        addButton.addEventListener('click', addToSelection);

        //Creazione del div contenente l'immagine principale
        imageDiv = document.createElement('div');
        image = document.createElement('img');
        image.setAttribute('class', 'mainImage');
        image.setAttribute('src', sbc.Immagine);
        imageDiv.appendChild(image);

        //Creazione del tag h1 contenente il nome 
        name = document.createElement('h2');
        let nameText = sbc.Nome
        if (sbc.Versione > 1) nameText += " " + sbc.Versione
        textName = document.createTextNode(nameText);
        name.appendChild(textName);

        //Creazione del div contenente le immagini dei sistemi operativi
        divOS = document.createElement('div');
        divOS.setAttribute('class', 'os');
        for (os of sbc["OS"]) {
            imageOS = document.createElement('img');
            imageOS.setAttribute('src', os.Icona.replace("{background}", "f5f6f7"));
            divOS.appendChild(imageOS);
        }

        //Creazione del pulsante per mostrare la descrizione
        showButton = document.createElement('a');
        showButton.setAttribute('class', 'showButton');
        boldTextShowButton = document.createElement('b');
        showButton.addEventListener('click', toggleDescription);
        textShowButton = document.createTextNode('Show more');
        boldTextShowButton.appendChild(textShowButton);
        showButton.appendChild(boldTextShowButton);

        //Creazione della descrizione non visibile inizialmente
        description = document.createElement('p');
        for (o in sbc.Description[0]) {
            boldTextDescriptionKey = document.createElement('b');
            textDescriptionKey = document.createTextNode(o + ': ');
            boldTextDescriptionKey.appendChild(textDescriptionKey);
            boldTextDescriptionKey.appendChild(textDescriptionKey);

            //Creazione del ritorno a capo
            textDescriptionValue = document.createTextNode(sbc.Description[0][o]);
            br = document.createElement('br');

            description.appendChild(boldTextDescriptionKey);
            description.appendChild(textDescriptionValue);
            description.appendChild(br);
        }
        description.setAttribute("class", nameClassHide);

        //Aggiunta degli elementi creati al div card
        card.appendChild(addButton);
        card.appendChild(imageDiv);
        card.appendChild(name);
        card.appendChild(divOS);
        card.appendChild(description);
        card.appendChild(showButton);

        //Aggiunta del div card alla sezione
        contentsDiv.appendChild(card);
    }
}

//Carica le schede Single Board Computer
function onJsonSBCs(json) {
    reset(json)
    importSBCs(json)
    checkAllElements()
}


function chargeSBCs() {
    fetch("../api/sbcs.php").then(onResponse).then(onJsonSBCs)
}