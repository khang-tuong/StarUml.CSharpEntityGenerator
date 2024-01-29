const baseHandler = require("./core/handlers/base-handler");

let info = {
  diagram: null,
  filePath: null,
  namespace: null
};

function init() {
  app.commands.register(
    "csharp.entity:generate",
    generateCode,
    "Generate entities"
  );
}

function generateCode() {
  baseHandler.handleBase(info);
}

exports.init = init;
