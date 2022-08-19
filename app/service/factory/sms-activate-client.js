const {Client: SmsActivateClient} = require("../../../libs/sms-activate");
const {environment} = require("../../environment/environment");

class SmsActivateClientFactory {
  create(container) {
    return new SmsActivateClient(environment.api.smsActivate.axios);
  }
}

module.exports = {
  SmsActivateClientFactory
};