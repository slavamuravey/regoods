const {CodeReceiverFactory} = require("./service/factory/code-receiver");
const {SeleniumWebdriverFactory} = require("./service/factory/selenium-webdriver");
const {SmsActivateClientFactory} = require("./service/factory/sms-activate-client");
const {WbUserRepositoryFactory} = require("./service/factory/wb-user-repository");
const {Container} = require("../libs/service-container");

const spec = new Map();

spec.set("code-receiver", {
  factory: new CodeReceiverFactory()
});
spec.set("selenium-webdriver", {
  factory: new SeleniumWebdriverFactory()
});
spec.set("sms-activate-client", {
  factory: new SmsActivateClientFactory()
});
spec.set("wb-user-repository", {
  factory: new WbUserRepositoryFactory()
});

const container = new Container(spec);

module.exports = {
  container
};
