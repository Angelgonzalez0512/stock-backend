"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unit_1 = __importDefault(require("./../schemas/unit"));
class UnitController {
    static async index(req, res) {
        try {
            const skip = Number(req.query.pageIndex) * Number(req.query.pageSize);
            let units;
            if (req.query.pageIndex && req.query.pageSize) {
                units = await unit_1.default.find().skip(skip).limit(Number(req.query.pageSize));
            }
            else {
                units = await unit_1.default.find();
            }
            const totalRows = await unit_1.default.count();
            res.json({ units, totalRows, success: true });
        }
        catch (err) {
            res.json(err);
        }
    }
    static async create(req, res) {
        try {
            const body = req.body;
            const categoria = new unit_1.default({
                nombre: body.nombre,
                unidad: body.unidad,
                estado: "activo",
            });
            const saveclient = await categoria.save();
            res.status(201).json({ success: true, message: "Unidad creada correctamente" });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
    static async edit(req, res) {
        try {
            const id = req.params.id;
            const categoriaquery = req.body;
            if (id) {
                const categoria = await unit_1.default.findById(id);
                if (categoria) {
                    categoria.denominacion = categoriaquery.denominacion;
                    categoria.estado = categoriaquery.estado;
                    categoria.save();
                    res.status(201).json({
                        success: true,
                        message: "Datos actualizados correctamente",
                    });
                }
                else {
                    res.status(200).json({ success: false, message: "No esta registrado" });
                }
            }
            else {
                res.status(200).json({ success: false, message: "Entrada invalida" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: "Entrada invalida", error: err });
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            if (id) {
                const eliminado = await unit_1.default.findById(id);
                if (eliminado) {
                    eliminado.estado = "baja";
                    eliminado.save();
                    res.status(200).json({ success: true, message: "Dado de baja correctamente" });
                }
                else {
                    res.status(200).json({ success: false, message: "No se puede dar de baja" });
                }
            }
            else {
                res.status(200).json({ success: false, message: "No se envio un identificador" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
    static async show(req, res) {
        try {
            const id = req.params.id;
            const unit = await unit_1.default.findById(id);
            res.json(unit);
        }
        catch (err) {
            res.json(err);
        }
    }
}
exports.default = UnitController;
