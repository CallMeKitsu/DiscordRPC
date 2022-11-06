class Status {
  constructor() {
    this.body = {
      state: "",
      details: "",
      large_image: "",
      large_text: "",
      small_image: "",
      small_text: "",
      buttons: {},
    };

    this.appID = ""

    return this
  }

  fromJson(str_json) {
    this.body = JSON.parse(json);

    return this
  }

  fromDoc(document) {
    this.appID = document.querySelector('#clientID').value
    this.body.state = document.querySelector("#state").value;
    this.body.details = document.querySelector("#details").value;
    this.body.large_image = document.querySelector("#large_image").value;
    this.body.large_text = document.querySelector("#large_text").value;
    this.body.small_image = document.querySelector("#small_image").value;
    this.body.small_text = document.querySelector("#small_text").value;

    return this
  }

  toRpc() {
    let res = {
        pid: process.pid,
        activity: {
            assets: {}
        }
    };

    if(!this.appID) return alert('NO ID PROVIDED')

    var Httpreq = new XMLHttpRequest();
        Httpreq.open("GET", `https://discordapp.com/api/oauth2/applications/${this.appID}/assets`, false);
        Httpreq.send(null);
    let assets = JSON.parse(Httpreq.responseText)

    if(this.body.details.length > 1) {
        res.activity.details = this.body.details
    }

    if(this.body.state.length > 1) {
        res.activity.state = this.body.state
    }

    if (this.body.large_image.length > 1) {
      if (assets.filter((x) => x.name === this.body.large_image).length === 0) {
        return alert("La clé de large_image n'existe pas dans cette application.");
      }
      res.activity.assets.large_image = this.body.large_image
    }

    if (this.body.small_image.length > 1) {
      if (assets.filter((x) => x.name === this.body.small_image).length === 0) {
        return alert("La clé de small_image n'existe pas dans cette application.");
      }
      res.activity.assets.small_image = this.body.small_image
    }

    return res;
  }
}

module.exports.Status = Status