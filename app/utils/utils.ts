import path from "path";
import fs from "fs";

export function createSnapshotDirPath() {
  return path.resolve(process.env.APP_PATH!, "data", "snapshot");
}

export async function createSnapshot(filePath: string, image: string) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, image, "base64");
}

export function createCookiesFilePath(userId: string): string {
  return path.resolve(createUserIdDirPath(userId), "cookies.json");
}

export function createUserIdDirPath(userId: string): string {
  return path.resolve(process.env.APP_PATH!, "data", "wb-user", userId);
}

export function createSmsActiveDirPath(): string {
  return path.resolve(process.env.APP_PATH!, "data", "sms-active");
}

export async function createSmsActiveRentId(number: string, rentId: string) {
  const filePath = createSmsActiveRentIdFilePath(number);
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, rentId);
}

export function createSmsActiveRentIdFilePath(number: string) {
  return path.resolve(createSmsActiveDirPath(), `${number}.txt`);
}