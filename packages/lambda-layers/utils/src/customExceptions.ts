export class MissingEnvironmentVariableException extends Error {
  constructor(variableName: string) {
    super(`Missing Env Var : ${variableName}`);
  }
}
