const bc = new BroadcastChannel("data");
let CACHE_CUSTOM = {}

bc.onmessage = (event) => {
  let statuses = JSON.parse(event.data);
  CACHE_CUSTOM = statuses
  displayCustomStatuses(statuses);
};

function displayCustomStatuses(statuses) {
  for (let field of document.getElementsByClassName("bttn-selected")) {
    field.classList.remove("bttn-selected");
  }

  document.querySelector('#custom').classList.add('bttn-selected')

  document.querySelector("#wrapper").innerHTML = "";

  for (let status of statuses) {
    let name = status.name;
    let ID = status.appID;
    let state = status.state;
    let details = status.details;

    let request = get(
      `https://discordapp.com/api/oauth2/applications/${ID}/assets`
    );
    let assets = JSON.parse(request);
    if (!Array.isArray(assets)) {
      alert(`Un CLIENT_ID fourni n'existe pas ou n'est pas reconnu.`);
      continue;
    }

    let cover = assets.filter((asset) => asset.name === status.large_image)[0]
      .id;
    cover = `https://cdn.discordapp.com/app-assets/${ID}/${cover}.png`;
    let small = assets.filter((asset) => asset.name === status.small_image)[0]
      .id;
    small = `https://cdn.discordapp.com/app-assets/${ID}/${small}.png`;

    let cover_text = assets.filter((asset) => asset.name === status.large_text);
    let small_text = assets.filter((asset) => asset.name === status.small_text);

    let button1 = "";
    let button2 = "";

    if (status.buttons.length > 0) {
      button1 = `<button class="discord-bttn">${status.buttons[0].label}</button>`;
      if (status.buttons.length > 1) {
        button2 = `<button class="discord-bttn">${status.buttons[1].label}</button>`;
      }
    }

    let HTML = `
        <div class="status" onclick='select(\`${JSON.stringify(
          status
        ).replaceAll("'", "")}\`, this)'>
            <!--<ion-icon class="close" onclick="close(this)" name="close"></ion-icon>-->
            <div class="images">
                <img class="large" src="${cover}" title="${cover_text}">
                <img class="small" src="${small}" title="${small_text}">
            </div>
            <div class="content">
                <span class="name">${name}</span>
                <span class="details">${details}</span>
                <span class="state">${state}</span>
                ${button1}
                ${button2}
            </div>
        </div>
        `;

    document.querySelector("#wrapper").innerHTML += HTML;
  }
}

function displayPresetStatuses() {

  for (let field of document.getElementsByClassName("bttn-selected")) {
    field.classList.remove("bttn-selected");
  }

  document.querySelector('#presets').classList.add('bttn-selected')

  document.querySelector("#wrapper").innerHTML = "";
  let presets = [{name: "BeatStars", appID: "1000370452302155867"}]
  let html = ``

  for (let preset of presets) {
    let assets = JSON.parse(get(`https://discordapp.com/api/oauth2/applications/${preset.appID}/assets`))
    
    if (!Array.isArray(assets)) {
      console.log(`Un CLIENT_ID fourni n'existe pas ou n'est pas reconnu.`);
      continue;
    }

    let str_assets = ''

    for(let asset of assets) {
      str_assets += `<img class="asset" src="https://cdn.discordapp.com/app-assets/${preset.appID}/${asset.id}.png" title="${asset.name}">`;  
    }

    html += `<div class="status" onclick='use( \`${JSON.stringify(preset)}\`, this )'>
      <span class="name">${preset.name}</span>
      <div class="assets" style="overflow: scroll-x">
        ${str_assets}
      </div>
    </div>`
  }

  document.querySelector("#wrapper").innerHTML = html

}

function get(yourUrl) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

function select(str_status, element) {
  for (let field of document.getElementsByClassName("selected")) {
    field.classList.remove("selected");
  }

  let status = JSON.parse(str_status);
  element.classList.add("selected");

  document.querySelector("#clientID").value = status.appID;
  document.querySelector("#state").value = status.state;
  document.querySelector("#details").value = status.details;
  document.querySelector("#large_image").value = status.large_image;
  document.querySelector("#large_text").value = status.large_text;
  document.querySelector("#small_image").value = status.small_image;
  document.querySelector("#small_text").value = status.small_text;
  document.querySelector("#appname").value = status.name;

  if (status.buttons && status.buttons[0]) {
    document.querySelector("#bttn-1-label").value = status.buttons[0].label;
    document.querySelector("#bttn-1-link").value = status.buttons[0].url;
  } else {
    document.querySelector("#bttn-1-label").value = "";
    document.querySelector("#bttn-1-link").value = "";
  }

  if (status.buttons && status.buttons[1]) {
    document.querySelector("#bttn-2-label").value = status.buttons[1].label;
    document.querySelector("#bttn-2-link").value = status.buttons[1].url;
  } else {
    document.querySelector("#bttn-2-label").value = "";
    document.querySelector("#bttn-2-link").value = "";
  }
}

function use(str_preset, element) {
  for (let field of document.getElementsByClassName("selected")) {
    field.classList.remove("selected");
  }

  let status = JSON.parse(str_preset);
  element.classList.add("selected");

  document.querySelector("#clientID").value = status.appID;
  document.querySelector("#appname").value = status.name;
}