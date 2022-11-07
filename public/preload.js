const fs = require("fs");
const rpc = require("discord-rpc");
let client = new rpc.Client({ transport: "ipc" });
const { Status } = require("../libs/status");

let status = new Status();

window.addEventListener("DOMContentLoaded", () => {
  sendData();

  document.querySelector("#run").addEventListener("click", (event) => {
    let clientID = document.querySelector("#clientID").value;
    if (!clientID) return alert("Le champ CLIENT_ID ne peut être vide !");

    status.fromDoc(document);
    if(!status.test()) return alert(`Le CLIENT_ID fourni n'existe pas ou n'est pas reconnu.`)

    client.login({ clientId: clientID });
  });

  document.querySelector("#save").addEventListener("click", (event) => {
    let clientID = document.querySelector("#clientID").value;
    if (!clientID) return alert("Le champ CLIENT_ID ne peut être vide !");

    let data = new Status().fromDoc(document);
    if(!data.test()) return alert(`Le CLIENT_ID fourni n'existe pas ou n'est pas reconnu.`)
    let object = data.body;
    object.appID = data.appID;
    object.name = data.name;
    fs.writeFileSync(
      `${__dirname.replace("public", "")}status/${Date.now()}.json`,
      JSON.stringify(object, null, "\t")
    );
    alert("Configuration successfully saved !");
    sendData();
  });
});

client.on("ready", () => {
  let config = status.toRpc();
  console.log("CONFIG", config);

  client.request("SET_ACTIVITY", config);

  alert("status loaded !");
});

function sendData() {
  let statuses = [];
  for (var filename of fs.readdirSync("./status")) {
    if (!filename.endsWith(".json")) return console.log("not a JSON file");

    statuses.push(JSON.parse(fs.readFileSync(`./status/${filename}`)));
  }

  const qr = new BroadcastChannel("data");
  qr.postMessage(JSON.stringify(statuses));
}
