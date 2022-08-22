import type { Client } from "../../../libs/random-data-tools/types";
import type { Gender, Name, RandomNameGenerator } from "../random-name-generator";

export class RandomNameGeneratorImpl implements RandomNameGenerator {
  private randomDataToolsClient: Client;

  constructor(randomDataToolsClient: Client) {
    this.randomDataToolsClient = randomDataToolsClient;
  }

  async generate(gender?: Gender): Promise<Name> {
    const genderMap: Record<string, "man" | "woman"> = {
      man: "man",
      woman: "woman",
    };

    const name = await this.randomDataToolsClient.getRandomName({ gender: gender ? genderMap[gender] : "unset" });

    return {
      firstName: name.FirstName,
      lastName: name.LastName,
    }
  }
}