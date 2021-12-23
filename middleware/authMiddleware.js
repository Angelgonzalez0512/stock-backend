"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class AuthMiddleware {
    static async Autenticate(req, res, next) {
        try {
            const token = req.get("Authorization");
            if (token) {
                jsonwebtoken_1.default.verify(token, config_1.default.TOKEN_SECRET_KEY, function (err, decoded) {
                    if (err) {
                        res.status(401).json({ success: false, message: "No autorizado" });
                    }
                    else {
                        next();
                    }
                });
            }
            else {
                res.status(401).json({ success: false, message: "No autorizado", alt: "token no llega" });
            }
        }
        catch (err) {
            res.status(401).json({ success: false, message: err.message });
        }
    }
}
exports.default = AuthMiddleware;
