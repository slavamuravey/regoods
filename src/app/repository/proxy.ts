export interface ProxyRepository {
  findAll(): Promise<string[]>;
}