"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("./../schemas/product"));
class ProductoController {
    static async index(req, res) {
        try {
            const skip = Number(req.query.pageIndex) * Number(req.query.pageSize);
            let products;
            if (req.query.pageIndex && req.query.pageSize) {
                products = await product_1.default.find().skip(skip).limit(Number(req.query.pageSize));
            }
            else {
                products = await product_1.default.find();
            }
            const totalRows = await product_1.default.count();
            res.json({ products, totalRows, success: true });
        }
        catch (err) {
            res.json(err);
        }
    }
    static async allForUser(req, res) {
        try {
            const products = await product_1.default.find({ categoria: "Alimentos" });
            const totalRows = products.length;
            res.json({ products, totalRows, success: true });
        }
        catch (err) {
            res.json(err);
        }
    }
    static async pagination(req, res) {
        try {
            const params = req.body;
            var products = [];
            var totalRows = 0;
            var field = params.sortField;
            const patern = params.globalFilter;
            var columorder = "";
            const order = params.sortOrder;
            order == 1 ? (columorder = `${field}`) : (columorder = `-${field}`);
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            if (patern == null && field == null) {
                products = await product_1.default.find().skip(params.first).limit(Number(params.rows));
                totalRows = await product_1.default.count();
            }
            else if (patern == null && field) {
                products = await product_1.default.find().skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await product_1.default.count();
            }
            else if (patern && field == null) {
                const searchRgx = rgx(patern);
                products = await product_1.default.find({
                    $or: [
                        { nombre: { $regex: searchRgx, $options: "i" } },
                        { codigo: { $regex: searchRgx, $options: "i" } },
                        { unidad: { $regex: searchRgx, $options: "i" } },
                        { categoria: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } }
                    ],
                }).skip(params.first).limit(Number(params.rows));
                totalRows = await product_1.default.find({
                    $or: [
                        { nombre: { $regex: searchRgx, $options: "i" } },
                        { codigo: { $regex: searchRgx, $options: "i" } },
                        { unidad: { $regex: searchRgx, $options: "i" } },
                        { categoria: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } }
                    ],
                }).count();
            }
            else {
                const searchRgx = rgx(patern);
                products = await product_1.default.find({
                    $or: [
                        { nombre: { $regex: searchRgx, $options: "i" } },
                        { codigo: { $regex: searchRgx, $options: "i" } },
                        { unidad: { $regex: searchRgx, $options: "i" } },
                        { categoria: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } }
                    ],
                }).skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await product_1.default.find({
                    $or: [
                        { nombre: { $regex: searchRgx, $options: "i" } },
                        { codigo: { $regex: searchRgx, $options: "i" } },
                        { unidad: { $regex: searchRgx, $options: "i" } },
                        { categoria: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } }
                    ],
                }).count();
            }
            res.json({ products, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async create(req, res) {
        try {
            const body = req.body;
            const producto = new product_1.default({
                codigo: body.codigo,
                nombre: body.nombre,
                cantidad: body.cantidad,
                unidad: body.unidad,
                precio: body.precio,
                categoria: body.categoria,
                estado: "activo",
            });
            const saveproducto = await producto.save();
            res
                .status(201)
                .json({ success: true, message: "Categoria creada correctamente" });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
    static async show(req, res) {
        try {
            const id = req.params.id;
            const categoria = await product_1.default.findById(id);
            res.json(categoria);
        }
        catch (err) {
            res.json(err);
        }
    }
    static async edit(req, res) {
        try {
            const id = req.params.id;
            const productoquery = req.body;
            if (id) {
                const producto = await product_1.default.findById(id);
                if (producto) {
                    producto.codigo = productoquery.codigo;
                    producto.nombre = productoquery.nombre;
                    producto.cantidad = productoquery.cantidad;
                    producto.unidad = productoquery.unidad;
                    producto.precio = productoquery.precio;
                    producto.categoria = productoquery.categoria;
                    producto.estado = productoquery.estado;
                    producto.save();
                    res.status(201).json({
                        success: true,
                        message: "Datos actualizados correctamente",
                    });
                }
                else {
                    res
                        .status(200)
                        .json({ success: false, message: "No esta registrado" });
                }
            }
            else {
                res.status(200).json({ success: false, message: "Entrada invalida" });
            }
        }
        catch (err) {
            res
                .status(500)
                .json({ success: false, message: "Entrada invalida", error: err });
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            if (id) {
                const eliminado = await product_1.default.findById(id);
                if (eliminado) {
                    eliminado.estado = "baja";
                    eliminado.save();
                    res
                        .status(200)
                        .json({ success: true, message: "Dado de baja correctamente" });
                }
                else {
                    res
                        .status(200)
                        .json({ success: false, message: "No se puede dar de baja" });
                }
            }
            else {
                res
                    .status(200)
                    .json({ success: false, message: "No se envio un identificador" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
}
exports.default = ProductoController;
