import { WebSocketServer } from "ws";
import path from 'path';
import { fileURLToPath } from 'url';


let clients_socket = []
let num_utenti = 0;
let cart = [];
let nomi_utenti = [];
let ready_counter = 0;
let estrazione = 0;
let cartelle_utenti = new Map();
let partita_iniziata = false;
let ambo = false, terna = false, quaterna = false, cinquina = false, tombola = false;
const wss = new WebSocketServer({ port: 8080 });
console.log(wss);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)


import express from 'express';

const app = express();

app.listen(8080, () =>
  console.log('Example app listening on port 3000!'),
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/script.js'));
})

wss.on('connection', function connection(ws) {
  if (partita_iniziata == true) {
    ws.send(JSON.stringify({ "accettato": false }));
    //const index = clients_socket.indexOf(ws);
    //clients_socket.splice(index, 1);
    //ws.close();
  } else {
    ws.mynfoid = num_utenti;
    clients_socket.push(ws);
    num_utenti++;
    console.log("client collegato");
    //console.log(ws.mynfoid);
    //console.log(ws)
    console.log(clients_socket.length)
    let cartella = generateTombolaCartella();


    //console.log(cartella);

    ws.send(JSON.stringify({ "cartella": cartella, "id": ws.mynfoid }));
    cartelle_utenti.set(ws.mynfoid, cartella);

  }
  ws.on('message', function message(data) {
    let message = JSON.parse(data)
    console.log(message)

    if (message.ready) {
      ready_counter++
      console.log(ready_counter)
      console.log(clients_socket.length)
      if (ready_counter == clients_socket.length && (clients_socket.length > 1 || cart.length > 0)) {
        partita_iniziata = true;
        estrai()
        controlla_vincite();
        ready_counter = 0;
      }
    }

    if(message.connected){
      console.log("nomi utenti: " + nomi_utenti);
      if(nomi_utenti.includes(message.nickname)){
        ws.send(JSON.stringify({"error": "nickname_not_available"}))
      }else{
        ws.send(JSON.stringify({"success": "nickname_available"}))
        ws.mynfoname = message.nickname;
        nomi_utenti.push(message.nickname)
      }
      
    }
  });

  ws.onclose = () => {
    console.log("The connection has been closed successfully.");
    //ready_counter--;
    if(clients_socket.length > 0){
    const index = clients_socket.indexOf(ws);
    //console.log(index)
    if(index > -1){
      cartelle_utenti.delete(clients_socket[index].mynfoid)
    clients_socket.splice(index, 1);
    for (let i = 0; i < clients_socket.length; i++) {
      clients_socket[i].send(JSON.stringify({ "reset_button": true }))
    }
    ready_counter = 0;
    //console.log("La lunghezza dei client è: " + clients_socket.length);
    ws.close()
  }
    }
    
  };

});


function estrai() {
  let rand = Math.floor(Math.random() * 90) + 1;
  if (cart.includes(rand)) {
    estrai();
    console.log("doppio");
  } else {
    estrazione++;
    cart[rand] = rand;
    console.log("Estratto: " + rand)
    console.log("LUNGHEZZA CLIENTS: " + clients_socket.length)
    for (let i = 0; i < clients_socket.length; i++) {
      clients_socket[i].send(JSON.stringify({ "numero_estratto": rand }))
    }
    if (estrazione == 90) {
      console.log("Tombola Terminata");
      //rincomincia();
      return;
    }
  }
}

function generateTombolaCartella() {
  const matrice = [];
  const numeriGenerati = [];
  for (let i = 0; i < 3; i++) {
    const riga = [];

    // colonna 0: numeri casuali da 0-9
    let numero = Math.floor(Math.random() * 9) + 1;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 9) + 1;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 1: numeri casuali da 10-19
    numero = Math.floor(Math.random() * 10) + 10;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 10) + 10;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 2: numeri casuali da 20-29
    numero = Math.floor(Math.random() * 10) + 20;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 10) + 20;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 3: numeri casuali da 30-39
    numero = Math.floor(Math.random() * 10) + 30;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 10) + 30;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 4: numeri casuali da 40-49
    numero = Math.floor(Math.random() * 10) + 40;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 10) + 40;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 5: numeri casuali da 50-59
    numero = Math.floor(Math.random() * 10) + 50;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 10) + 50;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 6: numeri casuali da 60-69
    numero = Math.floor(Math.random() * 10) + 60;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 10) + 60;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 7: numeri casuali da 70-79
    numero = Math.floor(Math.random() * 10) + 70;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 10) + 70;
    }
    numeriGenerati.push(numero);
    riga.push(numero);

    // colonna 8: numeri casuali da 80-90
    numero = Math.floor(Math.random() * 11) + 80;
    while (numeriGenerati.includes(numero)) {
      numero = Math.floor(Math.random() * 11) + 80;
    }
    numeriGenerati.push(numero);
    riga.push(numero);
    matrice.push(riga);
  }
  // rimuovi casualmente 4 numeri da ogni riga
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let index
      do {
        index = Math.floor(Math.random() * 9);
      } while (matrice[i][index] == 0);
      matrice[i][index] = 0;
    }
  }
  return matrice;
}


function controlla_vincite() {
  for (var [key, val] of cartelle_utenti) {
    console.log(key + ": " + val);
    let vittoria = 0
    let tomb = 0;
    let name_winner;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 9; j++) {
        if (cart.includes(val[i][j])) {
          vittoria++;
          tomb++;
        }
        if (vittoria == 2 && ambo == false) {
          ambo = true
          for(let i = 0; i< clients_socket.length; i++){
            if(key == clients_socket[i].mynfoid){
              name_winner = clients_socket[i].mynfoname
            }
          }
          for (let k = 0; k < clients_socket.length; k++) {
            clients_socket[k].send(JSON.stringify({ "win": "AMBO", "user_win": name_winner }))
          }
        }
        if (vittoria == 3 && terna == false) {
          terna = true
          for(let i = 0; i< clients_socket.length; i++){
            if(key == clients_socket[i].mynfoid){
              name_winner = clients_socket[i].mynfoname
            }
          }
          for (let k = 0; k < clients_socket.length; k++) {
            clients_socket[k].send(JSON.stringify({ "win": "TERNA", "user_win": name_winner }))
          }
        }

        if (vittoria == 4 && quaterna == false) {
          quaterna = true
          for(let i = 0; i< clients_socket.length; i++){
            if(key == clients_socket[i].mynfoid){
              name_winner = clients_socket[i].mynfoname
            }
          }
          for (let k = 0; k < clients_socket.length; k++) {
            clients_socket[k].send(JSON.stringify({ "win": "QUATERNA", "user_win": name_winner }))
          }
        }

        if (vittoria == 5 && cinquina == false) {
          cinquina = true
          for(let i = 0; i< clients_socket.length; i++){
            if(key == clients_socket[i].mynfoid){
              name_winner = clients_socket[i].mynfoname
            }
          }
          for (let k = 0; k < clients_socket.length; k++) {
            clients_socket[k].send(JSON.stringify({ "win": "CINQUINA", "user_win": name_winner }))
          }
        }
      }
      vittoria = 0;
    }


    if (tomb == 15 && tombola == false) {
      tombola = true
      for(let i = 0; i< clients_socket.length; i++){
        if(key == clients_socket[i].mynfoid){
          name_winner = clients_socket[i].mynfoname
        }
      }
      console.log("Tombola Terminata");
      for (let k = 0; k < clients_socket.length; k++) {
        clients_socket[k].send(JSON.stringify({ "win": "TOMBOLA", "user_win": name_winner, "stato_partita": "finita" }))
      }
      rincomincia();
      return 0;
    }

    console.log(vittoria)
  }
}

function rincomincia() {
  clients_socket = []
  num_utenti = 0;
  cart = [];
  ready_counter = 0;
  estrazione = 0;
  cartelle_utenti = new Map();
  partita_iniziata = false;
  nomi_utenti = [];
  ambo = false, terna = false, quaterna = false, cinquina = false, tombola = false;
}
