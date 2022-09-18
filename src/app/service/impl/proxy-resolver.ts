import type { ProxyResolver } from "../proxy-resolver";
import type { ProxyRepository } from "../../repository/proxy";
import _ from "lodash";

export class ProxyResolverImpl implements ProxyResolver {
  constructor(readonly proxyRepository: ProxyRepository) {
    this.proxyRepository = proxyRepository;
  }

  async resolve(): Promise<string> {
    const proxyList = await this.proxyRepository.findAll();

    const proxy = proxyList[_.random(0, proxyList.length - 1)];

    if (!proxy) {
      throw new Error("can't resolve proxy.");
    }

    return proxy;
  }
}
