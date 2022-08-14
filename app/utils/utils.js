const path = require("path");
const fs = require("fs");

function createSnapshotDirPath() {
  return path.resolve(process.env.APP_PATH, "data/snapshot");
}

async function createSnapshot(filePath, image) {
  await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, image, "base64");
}

module.exports = {
  createSnapshotDirPath,
  createSnapshot
};