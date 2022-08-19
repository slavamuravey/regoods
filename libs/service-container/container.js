class Container {
  spec;
  services = new Map();

  constructor(spec) {
    this.spec = spec;
  }

  get(name) {
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    if (!this.spec.has(name)) {
      throw new Error(`unknown service "${name}".`);
    }

    const service = this.spec.get(name).factory.create(this);

    this.services.set(name, service);

    return service;
  }
}

module.exports = {
  Container
};
