const {CodeReceiver} = require("../code-receiver");

class CodeReceiverFactory {
  create(container) {
    return new CodeReceiver(container.get("sms-activate-client"));
  }
}

module.exports = {
  CodeReceiverFactory
};