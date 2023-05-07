const fs = require("fs");

fs.copyFileSync("./package.json", "./dist/package.json");
fs.writeFileSync("./dist/.npmignore", "node_modules");
fs.copyFileSync("./README.md", './dist/README.md');
