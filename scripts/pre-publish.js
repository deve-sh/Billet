const fs = require("fs");

fs.copyFileSync("./package.json", "./dist/package.json");
fs.writeFileSync("./dist/.npmignore", "node_modules");
fs.writeFileSync("./dist/README.md", fs.readFileSync("./README.md", "utf-8"));
