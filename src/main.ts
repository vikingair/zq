import { CLI } from "brocolito";
import fs from "node:fs/promises";
import process from "node:process";

CLI.command(
  "run",
  "Allows to print results with given mutations on a JSON file",
)
  .arg("<file:file>", "the JSON file to use as input")
  .arg(
    "<eval-string>",
    "The string to evaluate and will have access to variable 'j'",
  )
  .action(async ({ file, evalString }) => {
    // deno-lint-ignore no-unused-vars
    const z = JSON.parse(await fs.readFile(file, "utf-8"));
    const r = (() => {
      // deno-lint-ignore no-unused-vars
      const CLI = undefined;
      // deno-lint-ignore no-unused-vars
      const fs = undefined;
      // deno-lint-ignore no-unused-vars
      const process = undefined;
      return eval(evalString);
    })();
    console.dir(r, { depth: null });
  });

CLI.parse(process.argv.toSpliced(2, 0, "run")); // this needs to be executed after all "commands" were set up
