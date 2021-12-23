"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const area_1 = __importDefault(require("./../schemas/area"));
class AreaController {
    static async index(req, res) {
        try {
            const areas = await area_1.default.find();
            res.json(areas);
        }
        catch (err) {
            res.json(err);
        }
    }
    static async create(req, res) {
        try {
            const body = req.body;
            const areas = await area_1.default.insertMany(req.body.areas);
            res.status(201).json({ success: true, message: "Areas insertadas correctamente" });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
}
exports.default = AreaController;
