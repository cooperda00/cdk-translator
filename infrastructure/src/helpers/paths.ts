import * as path from "path";
import * as fs from "fs";

// Traverses the directory until a .env file is found which is assumed to be the root directory
const findRootEnv = (searchPath: string): string => {
  if (searchPath === "/") {
    throw new Error(".env file not found in directory");
  }

  if (fs.readdirSync(searchPath).includes(".env")) {
    return searchPath;
  }

  return findRootEnv(path.join(searchPath, "../"));
};

export const projectRoot = findRootEnv(__dirname);
export const lambdasPackagesPath = path.resolve(
  path.join(projectRoot, "packages/lambdas")
);
export const lambdaLayersPath = path.resolve(
  path.join(projectRoot, "packages/lambda-layers/utils")
);
export const clientDistPath = path.resolve(
  path.join(projectRoot, "apps/client/dist")
);
