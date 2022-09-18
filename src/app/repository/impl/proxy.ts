import type { ProxyRepository } from "../proxy";
import fs from "fs";
import { createProxyFilePath } from "../../../utils/utils";

export class ProxyRepositoryImpl implements ProxyRepository {
  async findAll(): Promise<string[]> {
    const fileContent = await fs.promises.readFile(createProxyFilePath(), "utf8");
    return fileContent.toString().split("\n")
  }
}