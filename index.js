"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("./database");
app_1.app.get('/', (req, res) => {
    res.send("This is my application mean angular 12.4 whit express in server and mongodb in the database");
});
app_1.app.listen(app_1.app.get("port"), () => {
    console.log("listen on http://localhost:" + app_1.app.get("port"));
});
