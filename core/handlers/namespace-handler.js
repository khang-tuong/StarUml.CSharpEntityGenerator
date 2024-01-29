function handle(payload, next) {
  app.dialogs
    .showInputDialog("Enter namespace")
    .then(({ buttonId, returnValue }) => {
      if (buttonId === "ok") {
        payload.namespace = returnValue;
        next(payload);
      } else {
        app.toast.warning("Extension exited");
      }
    });
}

exports.handle = handle;
