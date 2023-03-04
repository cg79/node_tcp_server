var net = require("net");

class TeltonikaTcpClient {
  constructor(webBridge, name) {
    this.webBridge = webBridge;
    this.initWebUIBridgeMethods();
    this.name = name;
  }

  initWebUIBridgeMethods() {
    this.webBridge.executeWebUiMessage = (message) => {
      console.log("execute ", message);
    };
    this.webBridge.sendMessageToWebUI = (message) => {
      this.webBridge.onReceiveTeltonikaTcpMessage(message);
    };
  }
  connect() {
    this.client = new net.Socket();
    const client = this.client;
    client.connect(8007, "localhost", (err, b) => {
      console.log("Client Connected");
      //   client.write("Hello, server! Love, Client.");
      //this.sendMessageToServer({ who: "web" });
    });

    client.on("data", (data) => {
      console.log("Client Received: " + data);
      //   client.destroy(); // kill client after server's response
    });

    client.on("close", () => {
      console.log("Client Connection closed");
    });
  }

  sendMessageToServer(command) {
    this.client.write(JSON.stringify(command) + "\r\n");
  }

  sendToServerWhoIAm() {
    const command = {
      commandtype: "who",
      name: this.name,
    };

    this.sendMessageToServer(command);
  }

  sendToServerGPIO(command) {
    // commandtype: 'gpio'
    // message: 'set DOUT2'
    // to: 'router_1'
    // from: 'web'

    command.commandtype = "gpio";
    command.from = this.name;

    this.sendMessageToServer(command);
  }

  // sendToServerGPIO(command) {
  //   this.sendMessageToServer(command);
  // }
}

module.exports = TeltonikaTcpClient;
