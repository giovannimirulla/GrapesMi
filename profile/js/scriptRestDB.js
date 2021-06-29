//Quando ritorna un JSON e quindi l'invio della mail ha avuto successo, aggiorna il numero della mail inviate e se tutte inviate mostra la notifica di avvenuto invio 
function onJsonEmail(json) {
    numberSendedMails++;
    if (numberMailsToSend === numberSendedMails) showNotify("emailSended")
    updateNotifyEmails()
}

function animateCounter() {
    let h2 = notifyDiv.querySelector("h2")

    numberSendedMails = 0
    const target = +numberMailsToSend;
    const interval = target / 100;

    const updateCounter = () => {
        const value = +numberSendedMails;
        if (value < target) {
            numberSendedMails = Math.ceil(value + interval);
            h2.innerText = notifyData["email"].title.replace("{number}", numberSendedMails)
            setTimeout(() => {
                updateCounter()
            }, 1000);
        } else {
            showNotify("emailSended")
            h2.innerText = notifyData["email"].title.replace("{number}", numberSendedMails)
        }
    }

    updateCounter();
}

//Funzione per inviare le mails
function sendEmails() {
    //Resetto la pagina e mostro la notifica relativa alle mails
    reset()
    showNotify("update")
        // updateNotifyEmails()


    for (let sbc of outuputSelection[1]) {
        fetch("../api/update.php?sbc=" + sbc + "&project=" + outuputSelection[0]);
        fetch("../api/emailsUpdate.php?sbc=" + sbc + "&project=" + outuputSelection[0]).then(onResponse, onError).then(onJsonEmails).catch(onError)
    }
    //Inizio a inviare le mails con una POST
    /* for (let user of users) {
         for (let sbc of outuputSelection[1]) {
             if (sbc.indexOf(user.sbc) !== -1) {
                 setTimeout(function() {
                     fetch("https://" + RestDBUsername + ".restdb.io/mail", {
                         method: "post",
                         body: JSON.stringify({
                             to: user.email,
                             subject: "Your device is about to be updated - Grapes Mi",
                             html: "<div style='text-align:center'><h1>" + outuputSelection[0] + "</h1><p>Your device <b>" + user.sbc + "</b> is about to be updated!</p><img style='display:block;max-width: 100%; height:auto;' src='" + imageSBC[user.sbc] + "'/></div>",
                             company: "Grapes Mi",
                             sendername: "Grapes Mi"
                         }),
                         headers: {
                             "Content-Type": "application/json",
                             "Cache-Control": "no-cache",
                             "x-apikey": RestDBApiKey,
                             "X-Requested-With": "XMLHttpRequest"
                         }
                     }).then(onResponse, onError).then(onJsonEmail)
                 }, 500);
             }
         }
     }*/
}

function onJsonEmails(json) {
    showNotify("email")
    numberMailsToSend = json.length
    animateCounter()
}
//Dichiaro e inizializzo le variabili che mi serviranno per conteggiare le mails da inviare e mandate
let numberMailsToSend = 0
let numberSendedMails = 0