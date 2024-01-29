const codeGenerator = require("./core/generator");
const fs = require("fs");

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
  app.elementPickerDialog
    .showDialog("Select an ER Diagram", null, type.ERDDiagram)
    .then(payload => handleSelectDiagram(payload));
}

function handleSelectDiagram({ buttonId, returnValue }) {
  if (buttonId === "ok") {
    info.diagram = returnValue;
    app.dialogs
      .showInputDialog("Enter export file path")
      .then(payload => handleExportFilePath(payload));
  }
}

function handleExportFilePath({ buttonId, returnValue }) {
  if (buttonId === "ok") {
    info.filePath = returnValue;
    if (!fs.existsSync(info.filePath)) {
      window.alert("File path is not exist!");
      return;
    }

    app.dialogs
      .showInputDialog("Enter namespace")
      .then(payload => handleNamespace(payload));
  }
}

function handleNamespace({ buttonId, returnValue }) {
  if (buttonId === "ok") {
    info.namespace = returnValue;
    codeGenerator.generateCode(info);
  }
}

exports.init = init;
