const fs = require("fs");

function handle(payload, next) {
  app.dialogs
    .showInputDialog("Enter export file path")
    .then(({ buttonId, returnValue }) => {
      if (buttonId === "ok") {
        payload.filePath = returnValue;

        if (!fs.existsSync(payload.filePath)) {
          window.alert("File path does not exist!");
          return;
        }

        next(payload);
      } else {
        app.toast.warning("Extension exited");
      }
    });
}

exports.handle = handle;
