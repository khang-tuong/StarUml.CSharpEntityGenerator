const codeGenerator = require("../generator");

function handle(payload, next) {
  codeGenerator.generateCode(payload);
}
exports.handle = handle;
