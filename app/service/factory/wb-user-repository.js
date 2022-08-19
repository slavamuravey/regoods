const {WbUserRepository} = require("../../repository/wb-user");

class WbUserRepositoryFactory {
  create(container) {
    return new WbUserRepository(container.get("sms-activate-client"));
  }
}

module.exports = {
  WbUserRepositoryFactory
};
