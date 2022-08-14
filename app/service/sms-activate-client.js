const {Client: SmsActivateClient} = require("./../../libs/sms-activate");
const {environment} = require("./../environment/environment");

module.exports = {
  smsActivateClient: new SmsActivateClient(environment.api.smsActivate.axios)
}