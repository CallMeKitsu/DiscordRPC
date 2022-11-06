const fs = require("fs");
const rpc = require("discord-rpc");
const client = new rpc.Client({ transport: "ipc" });

let status = {
  state: "",
  details: "",
  large_image: "",
  large_text: "",
  small_image: "",
  small_text: "",
  buttons: {},
};

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

    status = {
      state: document.querySelector("#state").value,
      details: document.querySelector("#details").value,
      large_image: document.querySelector("#large_image").value,
      large_text: document.querySelector("#large_text").value,
      small_image: document.querySelector("#small_image").value,
      small_text: document.querySelector("#small_text").value,
      buttons: {},
    };

    client.login({ clientId: clientID }).catch(console.error);
  });
});

client.on("ready", () => {
  client.request("SET_ACTIVITY", {
    pid: process.pid,
    activity: {
      state: status.state,
      details: status.details,

      assets: {
        large_image: status.large_image,
        large_text: status.large_text,
        small_image: status.small_image,
        small_text: status.small_text,
      },
    },
  });

  alert("status loaded !");
});
