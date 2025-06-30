# ZQ

[![JSR](https://jsr.io/badges/@vl/zq)](https://jsr.io/@vl/zq)
[![JSR Score](https://jsr.io/badges/@vl/zq/score)](https://jsr.io/@vl/zq)

Replacement for `jq` and `yq` commands and more file type supports might follow.

- It is more leight-weight
- It does not invent its own syntax, but has more capabilities than any of them

## How?

It is simply based on any runtime supporting to execute JS (NodeJS/Bun/Deno).

## Examples

```sh
# print all keys of the JSON file
zq ./path/to/file.json "Object.keys(z)"

# print a nested value
zq ./path/to/file.yaml "z.arr[3].foo?.bar"

# print some computed value like sum of all values
zq ./path/to/file.json "Object.values(z).reduce((r, c) => r + c, 0)"

# do more complex work using IIFE
zq ./path/to/file.yaml -f "const foo = new Set(Object.values(z).map((v) => v.status)); return foo.size > 3 ? 'too many' : 'ok'"

# do mutations on the object
zq ./path/to/file.yaml -u "z.foo = 'bar'"

# pretty print everything not being a string, e.g. the entire content
zq ./path/to/file.json z
```
