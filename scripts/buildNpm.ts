import { build } from "https://deno.land/x/dnt@0.16.1/mod.ts";

await Deno.remove('./npm', { 'recursive': true })

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true
  },
  test: true,
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