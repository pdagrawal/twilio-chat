class Chat {
  constructor() {
    this.channel = null;
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

  joinChannel() {
    if (this.channel.state.status !== "joined") {
      this.channel.join().then(function(channel) {
        console.log("Joined General Channel");
      });
    } else {
      console.log("Already joined");
    }
  }

  setupChannel(channel) {
    this.channel = channel;
    this.joinChannel();
  }

  setupClient(client) {
    this.client = client;
    this.client.getChannelByUniqueName("general")
      .then((channel) => this.setupChannel(channel))
      .catch((error) => {
        this.client.createChannel({
          uniqueName: "general",
          friendlyName: "General Chat Channel"
        }).then((channel) => this.setupChannel(channel));
      });
  }
};
