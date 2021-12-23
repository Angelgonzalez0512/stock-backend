"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = __importDefault(require("./../schemas/category"));
class CategoriaController {
    static async index(req, res) {
        try {
            const skip = Number(req.query.pageIndex) * Number(req.query.pageSize);
            let categories;
            if (req.query.pageIndex && req.query.pageSize) {
                categories = await category_1.default.find().skip(skip).limit(Number(req.query.pageSize));
            }
            else {
                categories = await category_1.default.find();
            }
            const totalRows = await category_1.default.count();
            res.json({ categories, totalRows, success: true });
        }
        catch (err) {
            res.json(err);
        }
    }
    static async pagination(req, res) {
        try {
            const params = req.body;
            var categories = [];
            var totalRows = 0;
            var field = params.sortField;
            const patern = params.globalFilter;
            var columorder = "";
            const order = params.sortOrder;
            order == 1 ? columorder = `${field}` : columorder = `-${field}`;
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            if (patern == null && field == null) {
                categories = await category_1.default.find().skip(params.first).limit(Number(params.rows));
                totalRows = await category_1.default.count();
            }
            else if (patern == null && field) {
                categories = await category_1.default.find().skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await category_1.default.count();
            }
            else if (patern && field == null) {
                const searchRgx = rgx(patern);
                categories = await category_1.default.find({
                    $or: [
                        { denominacion: { $regex: searchRgx, $options: "i" } },
                    ],
                }).skip(params.first).limit(Number(params.rows));
                totalRows = await category_1.default.find({
                    $or: [
                        { denominacion: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            else {
                const searchRgx = rgx(patern);
                categories = await category_1.default.find({ $or: [
                        { denominacion: { $regex: searchRgx, $options: "i" } },
                    ], }).skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await category_1.default.find({
                    $or: [
                        { denominacion: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            ;
            res.json({ categories, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async create(req, res) {
        try {
            const body = req.body;
            const categoria = new category_1.default({
                denominacion: body.denominacion,
                estado: "activo",
            });
            const saveclient = await categoria.save();
            res.status(201).json({ success: true, message: "Categoria creada correctamente" });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
    static async show(req, res) {
        try {
            const id = req.params.id;
            const categoria = await category_1.default.findById(id);
            res.json(categoria);
        }
        catch (err) {
            res.json(err);
        }
    }
    static async edit(req, res) {
        try {
            const id = req.params.id;
            const categoriaquery = req.body;
            if (id) {
                const categoria = await category_1.default.findById(id);
                if (categoria.denominacion == "Alimentos") {
                    res.json({ success: false, message: "Esta categoria no puede ser modificada." });
                    return;
                }
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
                const eliminado = await category_1.default.findById(id);
                if (eliminado) {
                    if (eliminado.denominacion == "Alimentos") {
                        res.json({ success: false, message: "Esta categoria no puede darse de baja." });
                        return;
                    }
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
}
exports.default = CategoriaController;
