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

  if(statuses.length == 0) {
    document.querySelector("#wrapper").innerHTML += `
    <h1>Saved Statuses</h1>
    <p>Create a custom status by entering data in the right section and save it here by clicking the <ion-icon name='save'></ion-icon> button, in the right vertical menu !</p>`
    return
  }

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
      alert(`the provided CLIENT_ID doesn't exist or isn't recognized.`);
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
  let presets = JSON.parse(get('https://callmekitsu.com/h/drpc.json'))
  let html = ``

  for (let preset of presets) {
    let assets = JSON.parse(get(`https://discordapp.com/api/oauth2/applications/${preset.appID}/assets`))
    
    if (!Array.isArray(assets)) {
      console.log(`One of the provided CLIENT_IDs doesn't exist or isn't recognized => Will skip the app.`);
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

function displayDocs() {
  for (let field of document.getElementsByClassName("bttn-selected")) {
    field.classList.remove("bttn-selected");
  }

  document.querySelector('#docs').classList.add('bttn-selected')

  document.querySelector("#wrapper").innerHTML = `
  <h1>Documentation</h1>
  <h3>What is the CLIENT_ID ?</h3>
  <p>It refers to the id of a Discord Application. You can create one by clicking the <ion-icon name="add"></ion-icon> button. When it's done, click on "COPY" under "Application ID".</p>
  <h3>How to use the public presets ?</h3>
  <p>Click on the <ion-icon name="compass"></ion-icon> button and select the public app you want to use. It will put for you the ID of the app into the CLIENT_ID field. Then, hover an asset to know its name. It's this name that you will have to type into the "large_image" or "small_image" fields.</p>
  <h3>Why can't I change the app name ?</h3>
  <p>The app name is managed directly by the discord API. It means that you must go on the Discord-Dev portal to rename your app. When you use a public application, you can't change its name.</p>
  <h3>How to upload assets ?</h3>
  <p>On the discord dev portal (<ion-icon name="add"></ion-icon>) dashboard, select "rich presence" and then "art assets".</p>
  `;
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