import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "path";

try {
  await build({
    entryPoints: ["./tsc_out/src/index.js"],
    outdir: "./build",
    platform: "node",
    loader: {
      ".node": "copy", // others didn't work
    },
    bundle: true,
    minify: true,
    sourcemap: true,
  });
} catch (err) {
  console.error("failed to build: " + err.toString());
  process.exit();
}

// remove all the unwanted uws_***.node files
try {
  const uwsNativeFilename =
    "uws_" +
    process.platform +
    "_" +
    process.arch +
    "_" +
    process.versions.modules +
    ".node";

  const files = await fs.readdir("./build");
  files.forEach(async (file) => {
    if (
      /^uws_.*\.node$/.test(file) &&
      !file.includes(uwsNativeFilename.split(".node")[0])
    ) {
      await fs.unlink(path.join("./build", file));
    }
  });
} catch (err) {
  console.error("failed to remove files: " + err.toString());
  process.exit();
}

// copy .proto files into the build directory
try {
  await fs.mkdir("./build/auth_proto");
  await fs.mkdir("./build/chat_proto");
  await fs.copyFile("./auth_proto/auth.proto", "./build/auth_proto/auth.proto");
  await fs.copyFile("./chat_proto/chat.proto", "./build/chat_proto/chat.proto");
} catch (err) {
  console.error("failed to copy files: " + err.toString());
}
