const express = require("express");
const app = express();
const port = 3000;

const WebBridge = require("./web-bridge");
const TeltonikaTcpClient = require("./web-client");

const TeltonikaServer = require("./server");

const { wait, executeCommand } = require("./promise-helper");

let client1;
let client2;

const Orchestartor = {
  start: () => {
    debugger;
    console.log("orchestrator start");

    const server = new TeltonikaServer();
    server.start();

    executeCommand({ message: "test", time: 2 }).then((v) => {
      console.log("sdfsdf");
    });

    WebBridge.onReceiveTeltonikaTcpMessage = (message) => {
      console.log("execute ", message);
    };

    // startExecuteCommands([

    // ])

    Orchestartor.conectClient1();
    Orchestartor.conectClient2();
  },
  conectClient1: () => {
    client1 = new TeltonikaTcpClient(WebBridge, "web1");
    client1.connect();

    wait(2).then((v) => {
      client1.sendToServerWhoIAm();
      // client1.sendToServerGPIO({
      //   message: 'set DOUT2',
      //   to: 'router_1',
      // });
    });
  },
  conectClient2: () => {
    client2 = new TeltonikaTcpClient(WebBridge, "web2");
    client2.connect();

    wait(3).then((v) => {
      client2.sendToServerWhoIAm();

      wait(2).then(() => {
        client2.sendToServerGPIO({
          message: "set DOUT2",
          to: "web1",
        });
      });
    });
  },
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  Orchestartor.start();
});
