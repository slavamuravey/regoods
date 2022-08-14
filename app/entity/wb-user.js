class WbUser {
  id;
  cookie;

  constructor(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setCookie(value) {
    this.cookie = value;
  }

  getCookie() {
    return this.cookie;
  }
}

module.exports = {
  WbUser
};
