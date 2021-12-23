"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    MONGO_DB: process.env.DB_NAME || "pedidos",
    MONGO_USER: process.env.DB_USER || "admin",
    MONGO_PASSWORD: process.env.DB_PASSWORD || "",
    MONGO_PORT: process.env.DB_PORT || "",
    MONGO_HOST: process.env.DB_HOST || "localhost",
    APP_PORT: process.env.APP_PORT || 3000,
    TOKEN_EXPIRE: process.env.TOKEN_EXPIRE || 3600000,
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY || "angel05"
};
