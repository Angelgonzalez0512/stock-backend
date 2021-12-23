"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("./../schemas/product"));
const user_1 = __importDefault(require("./../schemas/user"));
const activity_1 = __importDefault(require("./../schemas/activity"));
const orderFood_1 = __importDefault(require("./../schemas/orderFood"));
const transaccion_1 = __importDefault(require("./../schemas/transaccion"));
class ReportController {
    static async reportProducto(req, res) {
        try {
            var products = [];
            if (req.body.categoria && req.body.estado) {
                products = await product_1.default.find({ categoria: req.body.categoria, estado: req.body.estado });
            }
            else if (!req.body.categoria && req.body.estado) {
                products = await product_1.default.find({ estado: req.body.estado });
            }
            else if (req.body.categoria && !req.body.estado) {
                products = await product_1.default.find({ categoria: req.body.categoria });
            }
            else {
                products = await product_1.default.find();
            }
            return res.json({ success: true, products });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async reportUser(req, res) {
        try {
            var users = await user_1.default.find();
            if (req.body.area && req.body.estado && req.body.rol) {
                users = await user_1.default.find({ area: req.body.area, estado: req.body.estado, rol: req.body.rol });
            }
            else if (!req.body.area && req.body.estado && req.body.rol) {
                users = await user_1.default.find({ estado: req.body.estado, rol: req.body.rol });
            }
            else if (req.body.area && !req.body.estado && req.body.rol) {
                users = await user_1.default.find({ area: req.body.area, rol: req.body.rol });
            }
            else if (req.body.area && req.body.estado && !req.body.rol) {
                users = await user_1.default.find({ area: req.body.area, estado: req.body.estado });
            }
            else if (req.body.area && !req.body.estado && !req.body.rol) {
                users = await user_1.default.find({ area: req.body.area });
            }
            else if (!req.body.area && req.body.estado && !req.body.rol) {
                users = await user_1.default.find({ estado: req.body.estado });
            }
            else if (!req.body.area && !req.body.estado && req.body.rol) {
                users = await user_1.default.find({ rol: req.body.rol });
            }
            else {
                users = await user_1.default.find();
            }
            return res.json({ success: true, users });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async reportActivity(req, res) {
        try {
            var activities = [];
            const fecha = req.body.date;
            if (!fecha) {
                res.json({ success: false, message: "Fecha no especificada" });
                return;
            }
            if (req.body.tipo && req.body.estado) {
                activities = await activity_1.default.find({ nombre: req.body.tipo, estado: req.body.estado, $or: [
                        { fechainicio: { $gte: fecha.start, $lte: fecha.end }, fechafin: { $gte: fecha.start, $lte: fecha.end } },
                        { createdAt: { $gte: fecha.start, $lte: fecha.end } }
                    ] }).populate("transacciones");
            }
            else if (!req.body.tipo && req.body.estado) {
                activities = await activity_1.default.find({ estado: req.body.estado, $or: [
                        { fechainicio: { $gte: fecha.start, $lte: fecha.end }, fechafin: { $gte: fecha.start, $lte: fecha.end } },
                        { createdAt: { $gte: fecha.start, $lte: fecha.end } }
                    ] }).populate("transacciones");
            }
            else if (req.body.tipo && !req.body.estado) {
                activities = await activity_1.default.find({ nombre: req.body.tipo, $or: [
                        { fechainicio: { $gte: fecha.start, $lte: fecha.end }, fechafin: { $gte: fecha.start, $lte: fecha.end } },
                        { createdAt: { $gte: fecha.start, $lte: fecha.end } }
                    ] }).populate("transacciones");
            }
            else {
                activities = await activity_1.default.find({ $or: [
                        { fechainicio: { $gte: fecha.start, $lte: fecha.end }, fechafin: { $gte: fecha.start, $lte: fecha.end } },
                        { createdAt: { $gte: fecha.start, $lte: fecha.end } }
                    ] }).populate("transacciones");
            }
            return res.json({ success: true, activities });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async reportTransactions(req, res) {
        try {
            var transactions = [];
            const fecha = req.body.date;
            if (!fecha) {
                res.json({ success: false, message: "Fecha no especificada" });
                return;
            }
            if (req.body.tipo) {
                transactions = await transaccion_1.default.find({ tipo: req.body.tipo, fecha: { $gte: fecha.start, $lte: fecha.end } }).populate("producto");
            }
            else {
                transactions = await transaccion_1.default.find({ fecha: { $gte: fecha.start, $lte: fecha.end } }).populate("producto");
            }
            return res.json({ success: true, transactions });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async reportOrderFoods(req, res) {
        try {
            var ordersfood = [];
            const fecha = req.body.date;
            if (!fecha) {
                res.json({ success: false, message: "Fecha no especificada" });
                return;
            }
            if (req.body.area && req.body.estado) {
                ordersfood = await orderFood_1.default.find({ area: req.body.area, estado: req.body.estado, fecha: { $gte: fecha.start, $lte: fecha.end } }).populate("usuario");
            }
            else if (!req.body.area && req.body.estado) {
                ordersfood = await orderFood_1.default.find({ estado: req.body.estado, fecha: { $gte: fecha.start, $lte: fecha.end } }).populate("usuario");
            }
            else if (req.body.area && !req.body.estado) {
                ordersfood = await orderFood_1.default.find({ area: req.body.area, fecha: { $gte: fecha.start, $lte: fecha.end } }).populate("usuario");
            }
            else {
                ordersfood = await orderFood_1.default.find({ fecha: { $gte: fecha.start, $lte: fecha.end } }).populate("usuario");
            }
            return res.json({ success: true, ordersfood });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
}
exports.default = ReportController;
