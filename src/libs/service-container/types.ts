export interface Container {
  get(name: string): any;
}

export interface ServiceFactory {
  create(container: Container): any;
}

export type ServiceSpec = Map<string, { factory: ServiceFactory }>;
