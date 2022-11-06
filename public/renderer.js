const bc = new BroadcastChannel("data");
let ids = [];

bc.onmessage = (event) => {
  let statuses = JSON.parse(event.data);

  for (let status of statuses) {
    let name = status.name;
    let ID = status.appID;
    let state = status.state;
    let details = status.details;

    let assets = JSON.parse(
      get(`https://discordapp.com/api/oauth2/applications/${ID}/assets`)
    );

    let cover = assets.filter((asset) => asset.name === status.large_image)[0]
      .id;
    cover = `https://cdn.discordapp.com/app-assets/${ID}/${cover}.png`;
    let small = assets.filter((asset) => asset.name === status.small_image)[0]
      .id;
    small = `https://cdn.discordapp.com/app-assets/${ID}/${small}.png`;

    let cover_text = assets.filter((asset) => asset.name === status.large_text);
    let small_text = assets.filter((asset) => asset.name === status.small_text);

    let HTML = `
        <div class="status" onclick='select(\`${JSON.stringify(status)}\`)'>
            <div class="images">
                <img class="large" src="${cover}" title="${cover_text}">
                <img class="small" src="${small}" title="${small_text}">
            </div>
            <div class="content">
                <span class="name">${name}</span>
                <span class="state">${state}</span>
                <span class="details">${details}</span>
            </div>
        </div>
        `;

    document.querySelector("#wrapper").innerHTML += HTML;
  }
};

function get(yourUrl) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}

function select(str_status) {
  let status = JSON.parse(str_status);

  document.querySelector("#clientID").value = status.appID;
  document.querySelector("#state").value = status.state;
  document.querySelector("#details").value = status.details;
  document.querySelector("#large_image").value = status.large_image;
  document.querySelector("#large_text").value = status.large_text;
  document.querySelector("#small_image").value = status.small_image;
  document.querySelector("#small_text").value = status.small_text;
}
