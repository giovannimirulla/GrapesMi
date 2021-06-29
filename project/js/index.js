function insertProjectInfo(json) {
    document.title = json.Nome + " - Grapes Mi";

    let principalData = document.createElement("div");
    let logoDiv = document.createElement("div");
    logoDiv.setAttribute("class", "logo");

    let logo = document.createElement("img");
    logo.setAttribute("src", json.Logo);

    logoDiv.appendChild(logo)

    let infoDiv = document.createElement("div");
    let title = document.createElement("h2");
    let titleText = document.createTextNode(json.Nome);
    title.appendChild(titleText);

    let description = document.createElement("p");
    let descriptionText = document.createTextNode(json.Descrizione);
    description.appendChild(descriptionText);

    infoDiv.appendChild(title);
    infoDiv.appendChild(description);

    let dataDiv = document.createElement("div");

    let collaborationsDiv = document.createElement("div");
    collaborationsDiv.setAttribute("id", "collaborations");

    //addCollaborations(json.Collaborations)
    let collaborations = json.Collaborations.slice(0, 3);
    for (let c of collaborations) {
        let type = c.Propic ? "img" : "p";
        let propic = document.createElement(type);
        propic.setAttribute("class", "propic")
        propic.setAttribute("title", c.Nome + " " + c.Cognome)
        if (type === "p") {
            let text = document.createTextNode(c.Nome.toUpperCase()[0] + c.Cognome.toUpperCase()[0])
            propic.appendChild(text);
        } else {
            propic.setAttribute("src", c.Propic)
        }
        collaborationsDiv.appendChild(propic);
    }
    dataDiv.appendChild(collaborationsDiv)

    let updateDate = document.createElement("p");
    let updateTitleDate = document.createElement("b");
    let updateTitleDateText = document.createTextNode("Updated: ")
    let updateDateText = document.createTextNode(json.DataUltimoAggiornamento);
    updateTitleDate.appendChild(updateTitleDateText);
    updateDate.appendChild(updateTitleDate);
    updateDate.appendChild(updateDateText);
    dataDiv.appendChild(updateDate);

    let createDate = document.createElement("p");
    let createTitleDate = document.createElement("b");
    let createTitleDateText = document.createTextNode("Created: ")
    let createDateText = document.createTextNode(json.DataAvvioProgetto);
    createTitleDate.appendChild(createTitleDateText);
    createDate.appendChild(createTitleDate);
    createDate.appendChild(createDateText);
    dataDiv.appendChild(createDate);

    principalData.appendChild(logoDiv);
    principalData.appendChild(infoDiv);

    menu.appendChild(principalData);
    menu.appendChild(dataDiv);

}

function addCollaborations(json) {
    console.log(json)
    const collaborationsDiv = document.querySelector("#collaborations");
    collaborationsDiv.innerHTML = ""
    let collaborations = json.slice(0, 3);
    for (let c of collaborations) {
        let type = c.Propic ? "img" : "p";
        let propic = document.createElement(type);
        propic.setAttribute("class", "propic")
        propic.setAttribute("title", c.Nome + " " + c.Cognome)
        if (type === "p") {
            let text = document.createTextNode(c.Nome.toUpperCase()[0] + c.Cognome.toUpperCase()[0])
            propic.appendChild(text);
        } else {
            propic.setAttribute("src", c.Propic)
        }
        collaborationsDiv.appendChild(propic);
    }
}

function onResponse(response) {
    return response.json();
}

function onJson(json) {
    insertProjectInfo(json)
    insertProjectData(json)
}

function onError(e) {
    console.log(e)
}

function animateCounter() {
    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        counter.innerText = '0'
        const target = +counter.getAttribute('data-target');
        const interval = target / 100;

        const updateCounter = () => {
            const value = +counter.innerText;
            if (value < target) {
                counter.innerText = Math.ceil(value + interval);
                setTimeout(() => {
                    updateCounter()
                }, 500);
            }
        }

        updateCounter();

    });
}

function animateBars() {
    const bars = document.querySelectorAll(".progressBarLine");

    bars.forEach(bar => {
        let lineProgressBar = bar.querySelector(".line")
        let percentage = bar.querySelector("span.percentage")
        percentage.innerText = '0 %'
        lineProgressBar.style.width = "0";
        const target = +percentage.getAttribute('data-target');
        const interval = target / 100;

        const updateBar = () => {
            const value = +percentage.innerText.split(" ")[0];
            if (value < target) {
                lineProgressBar.style.width = "calc(" + Math.ceil(value + interval) + "% - 8px)";
                percentage.innerText = Math.ceil(value + interval) + " %";
                setTimeout(() => {
                    updateBar()
                }, 10);
            }
        }

        updateBar();

    });
}

function insertProjectData(json) {

    let devicesDiv = document.createElement("div");
    devicesDiv.setAttribute("class", "numDevices")
    let numberDevices = document.createElement("span");
    numberDevices.setAttribute("class", "counter");
    numberDevices.setAttribute("data-target", json["DeviceNumber"]);
    let titleDevices = document.createElement("p");
    let titleDevicesText = document.createTextNode("devices")
    titleDevices.appendChild(titleDevicesText)
    devicesDiv.appendChild(numberDevices);
    devicesDiv.appendChild(titleDevices);

    container.appendChild(devicesDiv);

    let statistics = document.createElement("div");
    statistics.setAttribute("class", "centered");
    statistics.setAttribute("id", "statistics")

    let titleStatistics = document.createElement("h1");
    let titleStatisticsText = document.createTextNode("Statistics")
    titleStatistics.appendChild(titleStatisticsText)
    statistics.appendChild(titleStatistics);

    let subtitleStatistics = document.createElement("p");
    let subtitleStatisticsText = document.createTextNode("Percentage of updated devices")
    subtitleStatistics.appendChild(subtitleStatisticsText)
    statistics.appendChild(subtitleStatistics);


    for (let updatedPercentage in json["UpdatedPercentage"]) {
        let oneline = document.createElement("div");
        oneline.setAttribute("class", "oneLine progressBarLine");
        let sbc = document.createElement("span")
        let sbcText = document.createTextNode(updatedPercentage);
        sbc.appendChild(sbcText);
        oneline.appendChild(sbc);

        let progressBar = document.createElement("div");
        progressBar.setAttribute("class", "progressBar")
        let backgroundProgressBar = document.createElement("div");
        backgroundProgressBar.setAttribute("class", "background")
        let lineProgressBar = document.createElement("div");
        lineProgressBar.setAttribute("class", "line")
        lineProgressBar.style.width = "calc(" + json["UpdatedPercentage"][updatedPercentage] + "% - 8px)";
        progressBar.appendChild(backgroundProgressBar);
        progressBar.appendChild(lineProgressBar);
        oneline.appendChild(progressBar)

        let percentage = document.createElement("span")
        percentage.setAttribute("class", "percentage");
        percentage.setAttribute("data-target", json["UpdatedPercentage"][updatedPercentage]);
        oneline.appendChild(percentage);

        statistics.appendChild(oneline);

    }

    container.appendChild(statistics);

    let oneLineDiv = document.createElement("div")
    oneLineDiv.setAttribute("class", "oneLine lists")

    if (json["Devices"].length > 0) {
        let testedDeviceDiv = document.createElement("div");

        let titleTest = document.createElement("h1");
        let titleTestText = document.createTextNode("Tested on")
        titleTest.appendChild(titleTestText)
        testedDeviceDiv.appendChild(titleTest);

        let ul = document.createElement('ul');
        for (let device of json["Devices"]) {

            let li = document.createElement('li');
            let lispan = document.createElement('span');
            let nameText = device.Nome
            if (device.Versione > 1) nameText += " " + device.Versione
            let litext = document.createTextNode(nameText)
            lispan.appendChild(litext)
            li.appendChild(lispan)
            ul.appendChild(li)
        }
        testedDeviceDiv.appendChild(ul);
        oneLineDiv.appendChild(testedDeviceDiv);
    }

    if (json["OS"].length > 0) {
        let compiledDiv = document.createElement("div");

        let titleCompiled = document.createElement("h1");
        let titleCompiledText = document.createTextNode("Compiled for")
        titleCompiled.appendChild(titleCompiledText)
        compiledDiv.appendChild(titleCompiled);

        let ull = document.createElement('ul');
        for (let OS of json["OS"]) {
            let lii = document.createElement('li');
            lii.setAttribute("class", "centered")
            let liispan = document.createElement('span');
            let img = document.createElement("img")
            img.src = OS.Icona.replace("{background}", "f5f6f7");
            let liitext = document.createTextNode(OS.Nome)
            liispan.appendChild(liitext)
            lii.appendChild(img)
            lii.appendChild(liispan)
            ull.appendChild(lii)
        }
        compiledDiv.appendChild(ull);
        oneLineDiv.appendChild(compiledDiv);
    }
    container.appendChild(oneLineDiv);


    animateCounter();
    animateBars()
}

function toogleCollaboration(event) {
    if (event.currentTarget.textContent === "Remove") {
        event.currentTarget.textContent = "Add to my account"
        event.currentTarget.classList.remove("remove");
    } else {
        event.currentTarget.textContent = "Remove";
        event.currentTarget.classList.add("remove");
    }
    fetch("../api/collaboration.php?project=" + getValueFromURL("q") + "&id=" + user + "&toogle=true").then(onResponse, onError).then(onJsonTry).catch(onError);
}

function onJsonTry(json) {
    fetch("../api/project.php?q=" + getValueFromURL("q")).then(onResponse, onError).then(onJsonDivCollaboration).catch(onError);

}

function onJsonDivCollaboration(json) {
    addCollaborations(json.Collaborations)

}

function onJsonCollaboration(json) {
    fetch("../api/project.php?q=" + getValueFromURL("q")).then(onResponse, onError).then(onJsonDivCollaboration).catch(onError);
    let button = document.createElement("a")
    button.setAttribute("class", "projectButton")
    let text = "Add to my account";
    if (json.exists) {
        text = "Remove";
        button.classList.add("remove");
    }
    button.textContent = text;
    button.addEventListener("click", toogleCollaboration)
    container.appendChild(button)
}

const menu = document.querySelector(".menu");
const container = document.querySelector(".container");
fetch("../api/project.php?q=" + getValueFromURL("q")).then(onResponse, onError).then(onJson).catch(onError);

fetch("../api/collaboration.php?project=" + getValueFromURL("q") + "&id=" + user).then(onResponse, onError).then(onJsonCollaboration).catch(onError);