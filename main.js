const codeGenerator = require("./core/generator");
const fs = require('fs');

function init() {
    app.commands.register("csharp.entity:generate", generateCode, "Generate entities");
}

function generateCode() {
    app.elementPickerDialog.showDialog("Select an ER Diagram", null, type.ERDDiagram).then(function ({buttonId, returnValue}) {
        if (buttonId === 'ok') {
            const diagram = returnValue;
            app.dialogs.showInputDialog("Enter export file path").then(function ({buttonId, returnValue}) {
                if (buttonId === 'ok') {
                  const filePath = returnValue;
                  if (!fs.existsSync(filePath)) {
                      window.alert("File path is not exist!");
                      return;
                  }
                  
                  codeGenerator.generateCode(diagram, filePath);
                } 
            })
        }
    })
}

exports.init = init;
