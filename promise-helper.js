// var commands = [{message:"unu", time: 5}, {message:"doi", time: 7}]
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(command.message);
      resolve(command);
    }, command.time);
  });
}

function wait(sec) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, sec * 1000);
  });
}

function executeCommands(commands, index) {
  // let index = 0;
  if (index < commands.length) {
    return executeCommand(commands[index]).then((v) => {
      return executeCommands(commands, index + 1);
    });
  }
}

function startExecuteCommands(commands) {
  executeCommands(commands, 0);
}

function parseStringAsJson(str) {
  console.log(str);
  if (!str) {
    return {};
  }
  try {
    return JSON.parse(str);
  } catch (ex) {
    console.log(ex);
    return {};
  }
}

module.exports = {
  executeCommand,
  startExecuteCommands,
  wait,
  parseStringAsJson,
};
