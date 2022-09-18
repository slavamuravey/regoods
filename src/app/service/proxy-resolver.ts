export interface ProxyResolver {
  resolve(): Promise<string>;
}
