import { build } from "https://deno.land/x/dnt/mod.ts";

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  cjs: false,
  shims: {
    deno: true
  },
  package: {
    name: "fkm-nbt",
    version: Deno.args[0],
    description: "",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/KalmeMarq/FKM-NBT.git"
    },
    bugs: {
      url: "https://github.com/KalmeMarq/FKM-NBT/issues"
    }
  },
});

await Deno.copyFile("LICENSE", "npm/LICENSE");
await Deno.copyFile("README.md", "npm/README.md");