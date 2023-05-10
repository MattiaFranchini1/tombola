var ws = new WebSocket("wss://mattiafranchini1-fluffy-space-doodle-xjp95v9wpwcv5q6-8080.preview.app.github.dev/");

let username = 0;
let nickname;

ws.addEventListener("message", (event) => {
    //console.log('received:' + data);
    let message = JSON.parse(event.data)
    console.log(message)

    if (message.cartella) {
        username = message.id;
        console.log(message.cartella);
        creaTabella(message.cartella);
    }

    if(message.error){
        alert("NOME NON DISPONIBILE");
    }

    if(message.success){
        // Otteniamo gli elementi HTML con ID "log-in" e "partita"
    var div_vecchio = document.getElementById("log-in");
    var div_nuovo = document.getElementById("partita");

    // Nascondiamo l'elemento con ID "log-in"
    div_vecchio.hidden = true;

    // Mostriamo l'elemento con ID "partita"
    div_nuovo.hidden = false;
    document.getElementById("nome_utente_cartella").innerHTML = "LA TUA CARTELLA (" + nickname + ")";
    }

    if (message.reset_button == true) {
        const button1 = document.getElementById("button");
        button1.disabled = false;
    }


    if (message.accettato == false) {
        console.log("LA PARTITA E' GIA' INIZIATA")
        document.body.innerHTML = ""
        alert("Partita già avviata, non è stato possibile accedere.")
    }


    if (message.numero_estratto) {
        document.getElementById("numero_estratto").innerHTML = message.numero_estratto;
        console.log(message.numero_estratto)
        document.getElementById(message.numero_estratto).style.backgroundColor = "green";
        console.log(document.getElementById("c_" + message.numero_estratto))
        if (document.getElementById("c_" + message.numero_estratto)) {
            document.getElementById("c_" + message.numero_estratto).style.backgroundColor = "orange";
        }
        const button1 = document.getElementById("button");
        button1.disabled = false;
    }

    if (message.win) {
        if (message.user_win == nickname) {
            alert("Hai fatto " + message.win)
        } else {
            alert("L'utente " + message.user_win + " ha fatto " + message.win)
        }

        if (message.stato_partita == "finita") {
            if (message.user_win == nickname) {
                alert("La partita è terminata ed hai vinto!");
            } else {
                alert("La partita è terminata ed ha vinto " + message.user_win);
            }
            //document.body.innerHTML = ""
            document.getElementById("partita").hidden = true
            document.getElementById("reload").hidden = false
        }
    }

});



function pronto() {
    const button1 = document.getElementById("button");
    button1.disabled = true;
    ws.send(JSON.stringify({ "id": username, "ready": "yes" }));
}

function creaTabella(matrice) {
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered");

    for (let i = 0; i < matrice.length; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < matrice[i].length; j++) {
            const cell = document.createElement("td");
            cell.style.width = "100px";
            cell.style.height = "50px";

            if (matrice[i][j] != 0) {
                cell.textContent = matrice[i][j];
                cell.id = "c_" + matrice[i][j]
            } else {
                cell.textContent = "";
            }
            cell.classList.add("text-center", "align-middle", "border");
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    const container = document.getElementById("cartella_mia");
    container.appendChild(table);
}



function log_in() {
    nickname = document.getElementById("nome_utente").value;

    ws.send(JSON.stringify({
        "connected": "yes",
        "nickname": nickname
    }))

}

function reload(){
    location.reload();
}
