//Funzione per importare i contenuti con la creazione degli elementi (createElement) e l'aggiunta al rispettivo div #deploy .cards (appendChild)
function importSBCsDashboard(json) {
    //Dichiarazione delle variabili
    let id, card, addButton, imageDiv, image, name, textName, divOS, imageOS, showButton, boldTextShowButton, textShowButton, description, boldTextDescriptionKey, textDescriptionKey, textDescriptionValue, br
        //For per tutti gli elementi presenti nei contenuti
    if (json.length > 0) {
        for (let sbc of json) {

            //Creazione del div che conterrà tutti i valori dell'elemento
            card = document.createElement('div');
            card.setAttribute('class', 'card centered');

            //Creazione del div contenente l'immagine principale
            imageDiv = document.createElement('div');
            imageDiv.setAttribute("class", "rightDiv centered")

            image = document.createElement('img');
            image.setAttribute('class', 'mainImage centered');
            image.setAttribute('src', sbc.Immagine);
            imageDiv.appendChild(image);

            //Creazione del tag h1 contenente il nome
            let leftDiv = document.createElement("div");
            leftDiv.setAttribute("class", "leftDiv")

            name = document.createElement('h2');
            let nameText = sbc.Nome
            if (sbc.Versione > 1) nameText += " " + sbc.Versione
            textName = document.createTextNode(nameText);
            name.appendChild(textName);
            leftDiv.appendChild(name);

            //Creazione del div contenente le immagini dei sistemi operativi
            divOS = document.createElement('div');
            divOS.setAttribute('class', 'item leftTop');
            imageOS = document.createElement('img');
            imageOS.setAttribute('src', sbc.IconaSO.replace("{background}", "f5f6f7"));
            divOS.appendChild(imageOS);

            description = document.createElement('p');

            let array = { "Progetto": sbc.NomeProgetto, "Versione SO": sbc.VersioneSO }

            for (let o in array) {
                boldTextDescriptionKey = document.createElement('b');
                textDescriptionKey = document.createTextNode(o + ': ');
                boldTextDescriptionKey.appendChild(textDescriptionKey);
                boldTextDescriptionKey.appendChild(textDescriptionKey);

                //Creazione del ritorno a capo
                textDescriptionValue = document.createTextNode(array[o]);
                br = document.createElement('br');

                description.appendChild(boldTextDescriptionKey);
                description.appendChild(textDescriptionValue);
                description.appendChild(br);
            }

            leftDiv.appendChild(description);

            //Creazione del pulsante per l'aggiunta ai selezionati
            addButton = document.createElement('p');
            addButton.setAttribute('class', 'item status rightTop');
            let status = (sbc.Corrente == 1) ? '◉ Online' : '◉ Offline';
            let statusClass = (sbc.Corrente == 1) ? "statusGreen" : "statusRed";
            textAddButton = document.createTextNode(status);
            addButton.classList.add(statusClass);
            addButton.appendChild(textAddButton);
            //Creazione del pulsante per mostrare la descrizione
            /*   showButton = document.createElement('a');
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
                description.setAttribute("class", nameClassHide);*/

            //Aggiunta degli elementi creati al div card
            card.appendChild(imageDiv);
            card.appendChild(leftDiv)
            card.appendChild(addButton);
            card.appendChild(divOS)
                // card.appendChild(showButton);

            //Aggiunta del div card alla sezione
            dashboardCards.appendChild(card);
        }
    } else dashboardNotify.classList.remove("hidden")
}


function onJsonDashboard(json) {
    importSBCsDashboard(json);
}

const dashboardCards = document.querySelector("#Dashboard .cards")
const dashboardNotify = document.querySelector("#Dashboard #notify")
fetch("../api/dashboard.php?id=" + user).then(onResponse).then(onJsonDashboard)