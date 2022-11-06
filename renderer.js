const bc = new BroadcastChannel("data");
let ids = []

bc.onmessage = (event) => {
    let statuses = JSON.parse(event.data)
    
    for(let status of statuses) {
        let name = status.name
        let ID = status.appID
        let state = status.state
        let details = state.details

        let assets = JSON.parse(get(`https://discordapp.com/api/oauth2/applications/${ID}/assets`))
        
        let cover = assets.filter(asset => asset.name === status.large_image)[0].id
        cover = `https://cdn.discordapp.com/app-assets/${ID}/${cover}.png`
        let small = assets.filter(asset => asset.name === status.small_image)[0].id
        small = `https://cdn.discordapp.com/app-assets/${ID}/${small}.png`

        let cover_text = assets.filter(asset => asset.name === status.large_text)
        let small_text = assets.filter(asset => asset.name === status.small_text)
    
        let HTML = `
        <div class="status">
            <div class="images">
                <img class="large" src="${cover}" title="${cover_text}">
                <img class="small" src="${small}" title="${small_text}">
            </div>
            <div class="content">
                <span class="state">${state}</span>
                <span class="details">${details}</span>
                <span class="name">${name}</span>:<span class="id">${ID}</span>
            </div>
        </div>
        `

        document.querySelector('#wrapper').innerHTML += HTML
    
    }
}

function get(yourUrl) {
    var Httpreq = new XMLHttpRequest()
        Httpreq.open("GET", yourUrl, false)
        Httpreq.send(null)
    return Httpreq.responseText
}