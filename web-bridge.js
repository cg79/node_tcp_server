
const WebBridge =  {
  initWebUIBridgeMethods: () => {
    this.webBridge.onReceiveTeltonikaTcpMessage = (message) => {
      console.log("execute ", message);
    };
  }
}

// export default WebBridge;
module.exports = WebBridge;
