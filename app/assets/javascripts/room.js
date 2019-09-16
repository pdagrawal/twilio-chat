class Room {
  constructor() {
    this.room_sids = [];
    this.client = null;
    this.identity = null;
    this.initialize();
  }

  initialize() {
    Rails.ajax({
      url: "/tokens",
      type: "POST",
      success: data => {
        this.identity = data.identity;

        Twilio.Chat.Client
          .create(data.token)
          .then(client => this.setupClient(client));
      }
    });
  }

  joinChannel(channel) {
    if (channel.state.status !== "joined") {
      channel.join().then(function(channel) {
        console.log("Joined General Channel");
      });
    } else {
      console.log("Already joined");
    }
    channel.on("messageAdded", message => this.showMessage(message));
  }

  setupChannels() {
    for (var i = 0; i < this.room_sids.length; i++) {
      this.client.getChannelBySid(this.room_sids[i])
        .then((channel) => this.joinChannel(channel));
    }
  }

  setupClient(client) {
    this.client = client;

    Rails.ajax({
      url: "/chats/room_sids",
      type: "GET",
      success: data => {
        this.room_sids = data.room_sids;
        this.setupChannels();
      }
    });

    this.setupForm();
  }

  addRoom(channel, name) {
    this.joinChannel(channel);
    this.room_sids.push(channel.sid);
    var roomData = { friendly_name: name, twilio_sid: channel.sid }
    $.ajax({
      url: "/chats",
      type: "POST",
      dataType: "json",
      data: roomData,
      success: data => {
        console.log('Added in db');
      }
    });
  }

  setupForm() {
    const form = document.querySelector(".rooms form");
    const input = document.querySelector(".rooms form input");

    form.addEventListener("submit", event => {
      var name = input.value;
      event.preventDefault();
      this.client.createChannel({
        uniqueName: name,
        friendlyName: name
      }).then((channel) => this.addRoom(channel, name));
      input.value = "";
      return false;
    });
  }

  showMessage(message) {
    console.log(message.body);
    alert(message.body);
  }
};
