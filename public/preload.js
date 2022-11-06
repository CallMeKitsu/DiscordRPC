const fs = require("fs")

window.addEventListener('DOMContentLoaded', () => {

  let statuses = []
  for(var filename of fs.readdirSync('./status')) {
    if(!filename.endsWith(".json")) return console.log("not a JSON file")

    statuses.push(JSON.parse(fs.readFileSync(`./status/${filename}`)))

  }

  const qr = new BroadcastChannel("data")
  qr.postMessage(JSON.stringify(statuses))
  
})