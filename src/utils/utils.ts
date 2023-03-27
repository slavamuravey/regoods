import path from "path";
import fs from "fs";
import { ROOT_DIR } from "../settings";

export function createCookiesFilePath(userId: string, sessionId: string): string {
  return path.resolve(createUserSessionDirPath(userId, sessionId), "cookies.json");
}

export function createUserAgentFilePath(userId: string, sessionId: string): string {
  return path.resolve(createUserSessionDirPath(userId, sessionId), "user-agent.txt");
}

export function createUserSessionDirPath(userId: string, sessionId: string): string {
  return path.resolve(createUserSessionsDirPath(userId), sessionId);
}

export function createUserSessionsDirPath(userId: string): string {
  return path.resolve(createUserDirPath(userId), "sessions");
}

export async function storeUserAgent(userId: string, sessionId: string, userAgent: string) {
  const filePath = createUserAgentFilePath(userId, sessionId);
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, userAgent);
}

export async function storeCookies(userId: string, sessionId: string, cookies: string) {
  const filePath = createCookiesFilePath(userId, sessionId);
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, cookies);
}

export function createUserDirPath(userId: string): string {
  return path.resolve(createUsersDirPath(), userId);
}

export function createUsersDirPath(): string {
  return path.resolve(createDataDirPath(), "wb-user");
}

export function createSmsActiveDirPath(): string {
  return path.resolve(createDataDirPath(), "sms-active");
}

export function createDataDirPath(): string {
  return path.resolve(ROOT_DIR, "data");
}

export function createScreencastDirPath() {
  return path.resolve(createDataDirPath(), "screencast");
}

export async function storeScreencastFrame(screencastId: string, screencastFrameFileName: string, image: string) {
  const filePath = path.resolve(createScreencastDirPath(), screencastId, screencastFrameFileName);
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, image, "base64");
}

export async function storeSmsActiveRentId(number: string, rentId: string) {
  const filePath = createSmsActiveRentIdFilePath(number);
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, rentId);
}

export function createSmsActiveRentIdFilePath(number: string) {
  return path.resolve(createSmsActiveDirPath(), `${number}.txt`);
}

export function createLogDirPath(): string {
  return path.resolve(ROOT_DIR, "log");
}

export function createProxyFilePath(): string {
  return path.resolve(createDataDirPath(), "proxy.txt");
}

export function createDeliveryCodesFilePath(): string {
  return path.resolve(createDataDirPath(), "codes.csv");
}

export function createRedemptionFilePath(): string {
  return path.resolve(createDataDirPath(), "redemption.csv");
}
