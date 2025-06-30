import { describe, it } from "@std/testing/bdd";
import { assertSpyCall, stub } from "@std/testing/mock";
import { CLI } from "brocolito";
import test1JSON from "./test1.json" with { type: "json" };

const parseStub = stub(CLI, "parse");
await import("../src/main.ts");
parseStub.restore();

const call = (file: string, evalString: string, ...options: string[]) =>
  CLI.parse(["nodeFile", "scriptFile", "run", file, evalString, ...options]);

describe("zq", () => {
  it("print all keys of the JSON file", async () => {
    // given
    using log = stub(console, "dir");

    // when
    await call("./test/test1.json", "Object.keys(z)");

    await call("./test/test1.json", "String(Object.keys(z))");

    // then
    log.calls[0].args[0] = [...log.calls[0].args[0]]; // HINT: The used array in VM uses a different Array.prototype.contructor
    assertSpyCall(log, 0, {
      args: [["Jorge", "Tamara", "Alex"], { depth: null }],
    });
    assertSpyCall(log, 1, { args: ["Jorge,Tamara,Alex", { depth: null }] });
  });

  it("print a nested value", async () => {
    // given
    using log = stub(console, "dir");

    // when
    await call("./test/test2.json", "z.arr[3].foo?.bar");

    // then
    assertSpyCall(log, 0, { args: ["foobar", { depth: null }] });
  });

  it("print some computed value like sum of all values", async () => {
    // given
    using log = stub(console, "dir");

    // when
    await call(
      "./test/test2.json",
      "Object.values(z.arr).reduce((r, c) => r + c.num, 0)",
    );

    // then
    assertSpyCall(log, 0, { args: [14, { depth: null }] });
  });

  it("print some computed value like sum of all values", async () => {
    // given
    using log = stub(console, "dir");

    // when
    await call(
      "./test/test3.json",
      "const foo = new Set(Object.values(z).map((v) => v.status)); return foo.size > 3 ? 'too many' : 'ok'",
      "-f",
    );

    // then
    assertSpyCall(log, 0, { args: ["too many", { depth: null }] });
  });

  it("print entire content", async () => {
    // given
    using log = stub(console, "dir");

    // when
    await call(
      "./test/test1.json",
      "z",
    );

    // then
    assertSpyCall(log, 0, { args: [test1JSON, { depth: null }] });
  });

  it("print mutated object", async () => {
    // given
    using log = stub(console, "dir");

    // when
    await call(
      "./test/test1.json",
      "z.Michael = { email: 'michael@example.com' }",
      "-u",
    );

    // then
    log.calls[0].args[0].Michael = { ...log.calls[0].args[0].Michael }; // HINT: The used array in VM uses a different Object.prototype.contructor
    assertSpyCall(log, 0, {
      args: [{ ...test1JSON, Michael: { email: "michael@example.com" } }, {
        depth: null,
      }],
    });
  });
});
