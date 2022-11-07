class Status {
  constructor() {
    this.body = {
      state: "",
      details: "",
      large_image: "",
      large_text: "",
      small_image: "",
      small_text: "",
      buttons: [],
    };

    this.appID = "";
    this.name = '@Application'

    return this;
  }

  test() {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open(
      "GET",
      `https://discordapp.com/api/oauth2/applications/${this.appID}/assets`,
      false
    );
    Httpreq.send(null);
    let request = Httpreq.responseText;
    let assets = JSON.parse(request);

    if (!Array.isArray(assets)) {
      return false;
    }
    return true;
  }

  fromDoc(document) {
    this.appID = document.querySelector("#clientID").value;
    this.body.state = document.querySelector("#state").value;
    this.body.details = document.querySelector("#details").value;
    this.body.large_image = document.querySelector("#large_image").value;
    this.body.large_text = document.querySelector("#large_text").value;
    this.body.small_image = document.querySelector("#small_image").value;
    this.body.small_text = document.querySelector("#small_text").value;
    
    if(document.querySelector("#appname").value.length > 0) {
      this.name = document.querySelector("#appname").value
    }

    this.body.buttons = [
      {
        label: document.querySelector("#bttn-1-label").value,
        url: document.querySelector("#bttn-1-link").value,
      },
      {
        label: document.querySelector("#bttn-2-label").value,
        url: document.querySelector("#bttn-2-link").value,
      },
    ];

    return this;
  }

  toRpc() {
    let res = {
      pid: process.pid,
      activity: {
        assets: {},
      },
    };

    if (!this.appID) return alert("NO ID PROVIDED");

    var Httpreq = new XMLHttpRequest();
    Httpreq.open(
      "GET",
      `https://discordapp.com/api/oauth2/applications/${this.appID}/assets`,
      false
    );

    Httpreq.send(null);
    let assets = JSON.parse(Httpreq.responseText);

    if (this.body.details.length > 1) {
      res.activity.details = this.body.details;
    }

    if (this.body.state.length > 1) {
      res.activity.state = this.body.state;
    }

    if (this.body.large_image.length > 1) {
      if (assets.filter((x) => x.name === this.body.large_image).length === 0) {
        return alert(
          "La clé de large_image n'existe pas dans cette application."
        );
      }
      res.activity.assets.large_image = this.body.large_image;
    }

    if (this.body.small_image.length > 1) {
      if (assets.filter((x) => x.name === this.body.small_image).length === 0) {
        return alert(
          "La clé de small_image n'existe pas dans cette application."
        );
      }
      res.activity.assets.small_image = this.body.small_image;
    }

    if (this.body.buttons && this.body.buttons[0]) {
      if (this.body.buttons[0].label && this.body.buttons[0].url) {
        res.activity.buttons = []
        res.activity.buttons.push({
          label: this.body.buttons[0].label,
          url: this.body.buttons[0].url
        })
      } if (this.body.buttons[1].label && this.body.buttons[1].url) {
        res.activity.buttons.push({
          label: this.body.buttons[1].label,
          url: this.body.buttons[1].url
        })
      }
    }

    return res;
  }
}

module.exports.Status = Status;