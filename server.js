// Include Nodejs' net module.

const Net = require("net");
const { parseStringAsJson } = require("./promise-helper");
// const ngrok = require('ngrok');
// The port on which the server is listening.

const port = 8007;

const sockets = {};

// let count = 0;

class TeltonikaServer {
  constructor() {
    this.count = 0;
  }

  start() {
    const server = new Net.Server();
    // The server listens to a socket for a client to make a connection request.
    // Think of a socket as an end point.

    server.listen(port, () => {
      console.log(
        `Server listening for connection requests on socket localhost:${port}`
      );

      // ngrok.connect(port, function (err, url) {
      //     if(err) {
      //         console.log("NGROK error, ", err);
      //     }
      //     console.log(`Node.js local server is publicly-accessible at ${url}`);
      // });

      console.log("ajunge aici");
    });

    server.on("connection", (socket) => {
      console.log("A new connection has been established.");
      this.count = this.count + 1;
      console.log(this.count);

      // Now that a TCP connection has been established, the server can send data to
      // the client by writing to its socket.
      //   socket.write("Hello, client.\r\n");

      // console.log("hello message sent");

      // executeCommandOnTeltonika(socket, 'open\r\n', 5000);

      // const closeCommand = () => executeCommandOnTeltonika('close', 6000);
      //   executeCommandOnTeltonika("open", 5000).then((v) => {
      //     executeCommandOnTeltonika("close", 6000).then((v) => {
      //       executeCommandOnTeltonika("open", 6000).then((v) => {
      //         console.log("that is it");
      //       });
      //     });
      //   });

      // The server can also receive data from the client by reading from its socket.
      socket.on("data", (chunk) => {
        debugger;
        const chunkAsString = chunk.toString();
        console.log('Data received from client: ', chunkAsString);
        const clientData = parseStringAsJson(chunkAsString);
        console.log(clientData);

        switch(clientData.commandtype){
            case "who": {
                sockets[clientData.name] = socket;
                console.log('adding socket ', clientData.name);
                // socket.write("gg");
                break;
            }
            case "gpio": {
                console.log('gpio')
                console.log(clientData)
                const to = clientData.to;
                if(!to) {
                    console.log("please provide the to router name");
                }
                const socketInstance = sockets[to];
                if(!socketInstance){
                    console.log('socket ', to , ' not found');
                }
                socketInstance.write(clientData);
                break;
            }
            default: {
              console.log("default");
              break;
            }
        }

      });

      // When the client requests to end the TCP connection with the server, the server
      // ends the connection.
      socket.on("end", () => {
        console.log("Closing connection with the client");
        this.count = this.count - 1;
        console.log(this.count);
      });

      // Don't forget to catch error, for your own sake.
      socket.on("error", (err) => {
        console.log(`Error: ${err}`);
      });
    });
  }

  executeCommandOnTeltonika(command, delay = 5000, nextExecuteCommand) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(
          "sending " + command + " to teltonika at ",
          new Date().toLocaleString()
        );
        sockets[0].write(command + "\r\n");
        if (!nextExecuteCommand) {
          return resolve(1);
        }
        const func = nextExecuteCommand();
        return func().then((value) => {
          resolve(value);
        });
      }, delay);
    });
  }
}

module.exports = TeltonikaServer;
