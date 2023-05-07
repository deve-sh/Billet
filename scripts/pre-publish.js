const fs = require("fs");

fs.copyFileSync("./package.json", "./dist/package.json");
fs.writeFileSync("./dist/.npmignore", "node_modules");
fs.mkdirSync('./dist/docs');
fs.copyFileSync('./docs/f-log-overview.png', './dist/docs/f-log-overview.png');
fs.copyFileSync("./README.md", './dist/README.md');
