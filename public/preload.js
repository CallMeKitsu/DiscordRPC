const fs = require("fs");
const rpc = require("discord-rpc");
let client = new rpc.Client({ transport: "ipc" });
const { Status } = require('../libs/status')

let status = new Status()

window.addEventListener("DOMContentLoaded", () => {
  let statuses = [];
  for (var filename of fs.readdirSync("./status")) {
    if (!filename.endsWith(".json")) return console.log("not a JSON file");

    statuses.push(JSON.parse(fs.readFileSync(`./status/${filename}`)));
  }

  const qr = new BroadcastChannel("data");
  qr.postMessage(JSON.stringify(statuses));

  document.querySelector("#run").addEventListener("click", (event) => {
    let clientID = document.querySelector("#clientID").value;
    if(!clientID) return alert('Le champ CLIENT_ID ne peut être vide !')
    
    status.fromDoc(document)

    client.login({ clientId: clientID })
  });

});

client.on("ready", () => {
  let config = status.toRpc()
  console.log("CONFIG", config)

  client.request("SET_ACTIVITY", config);

  alert("status loaded !");
})