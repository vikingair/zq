import { CLI } from "brocolito";
import fs from "node:fs/promises";
import process from "node:process";
import vm from "node:vm";

CLI.meta.name = "zq";

const getResult = (
  sandbox: { z: unknown },
  update: boolean,
  iife: boolean,
  evalString: string,
): unknown => {
  if (update) {
    vm.runInContext(evalString, sandbox);
    return sandbox.z;
  } else if (iife) {
    return vm.runInContext(`(() => { ${evalString} })()`, sandbox);
  } else {
    return vm.runInContext(evalString, sandbox);
  }
};

CLI.command(
  "run",
  "Allows to print results with given mutations on a JSON file",
)
  .option("--update|-u", "mutates the given object")
  .option(
    "--iife|-f",
    "wraps the input into function [IIFE] (requires return statement)",
  )
  .arg("<file:file>", "the JSON file to use as input")
  .arg(
    "<eval-string>",
    "The string to evaluate and will have access to variable 'j'",
  )
  .action(async ({ file, evalString, update, iife }) => {
    const z = JSON.parse(await fs.readFile(file, "utf-8"));
    const sandbox = { z };
    vm.createContext(sandbox);
    const r = getResult(sandbox, update, iife, evalString);
    console.dir(r, { depth: null });
  });

CLI.parse(process.argv.toSpliced(2, 0, "run")); // this needs to be executed after all "commands" were set up
