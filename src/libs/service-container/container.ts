import type { Container as ContainerInterface, ServiceSpec } from "./types";

export class Container implements ContainerInterface {
  private spec: ServiceSpec;
  private services = new Map<string, any>();

  constructor(spec: ServiceSpec) {
    this.spec = spec;
  }

  get(name: string): any {
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    if (!this.spec.has(name)) {
      throw new Error(`unknown service "${name}".`);
    }

    const service = this.spec.get(name)!.factory.create(this);

    this.services.set(name, service);

    return service;
  }
}
