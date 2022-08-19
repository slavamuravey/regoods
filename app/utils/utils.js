const path = require("path");
const fs = require("fs");

function createSnapshotDirPath() {
  return path.resolve(process.env.APP_PATH, "data/snapshot");
}

async function createSnapshot(filePath, image) {
  await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, image, "base64");
}

function createCookiesFilePath(userId) {
  return path.resolve(createUserIdDirPath(userId), "cookies.json");
}

function createUserIdDirPath(userId) {
  return path.resolve(process.env.APP_PATH, "data/wb-user", userId);
}

function createRentIdFilePath(userId) {
  return path.resolve(createUserIdDirPath(userId), "rent-id.txt");
}

module.exports = {
  createSnapshotDirPath,
  createSnapshot,
  createCookiesFilePath,
  createUserIdDirPath,
  createRentIdFilePath
};