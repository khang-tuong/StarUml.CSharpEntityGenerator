const diagramHandler = require("./diagram-select-handler");
const filePathHandler = require("./file-path-handler");
const namespaceHandler = require("./namespace-handler");
const stepDoneHandler = require("./step-done-handler");

function handle(payload) {
  if (payload.diagram === null) {
    diagramHandler.handle(payload, handle);
  } else if (payload.filePath === null) {
    filePathHandler.handle(payload, handle);
  } else if (payload.namespace === null) {
    namespaceHandler.handle(payload, handle);
  } else {
    stepDoneHandler.handle(payload);
  }
}

exports.handleBase = handle;
