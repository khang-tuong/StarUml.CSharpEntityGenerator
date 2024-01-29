function handle(payload, next) {
  app.elementPickerDialog
    .showDialog("Select an ER Diagram", null, type.ERDDiagram)
    .then(({ buttonId, returnValue }) => {
      if (buttonId === "ok") {
        payload.diagram = returnValue;
        next(payload);
      } else {
        app.toast.warning("Extension exited");
      }
    });
}

exports.handle = handle;
