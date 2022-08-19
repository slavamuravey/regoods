import fs from "fs";

function createEnvPath(dirname: string, envFileName: string): string {
  return `${dirname}/${envFileName}`;
}

export function findEnvFile(dirname: string, env?: string): string {
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
