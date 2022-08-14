const fs = require("fs");

function createEnvPath(dirname, envFileName) {
  return `${dirname}/${envFileName}`;
}

function findEnvFile(dirname, env) {
  if (env !== undefined) {
    const localEnvFile = createEnvPath(dirname, `.env.${env}.local`);

    if (fs.existsSync(localEnvFile)) {
      return localEnvFile;
    }

    return createEnvPath(dirname, `.env.${env}`);
  }

  const localEnvFile = createEnvPath(dirname, ".env.local");

  if (fs.existsSync(localEnvFile)) {
    return localEnvFile;
  }

  return createEnvPath(dirname, ".env");
}

module.exports = {
  findEnvFile
};
