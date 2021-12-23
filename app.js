"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.express = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.express = express_1.default;
const config_1 = __importDefault(require("./config"));
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
exports.app = app;
app.set("port", config_1.default.APP_PORT);
app.use(cors_1.default());
app.use(morgan_1.default("tiny"));
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(index_1.default);
