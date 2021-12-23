"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaccion_1 = __importDefault(require("../schemas/transaccion"));
const product_1 = __importDefault(require("../schemas/product"));
class TransaccionController {
    static async index(req, res) {
        try {
            const skip = Number(req.query.pageIndex) * Number(req.query.pageSize);
            let products;
            if (req.query.pageIndex && req.query.pageSize) {
                products = await transaccion_1.default.find().skip(skip).limit(Number(req.query.pageSize));
            }
            else {
                products = await transaccion_1.default.find();
            }
            const totalRows = await transaccion_1.default.count();
            res.json({ products, totalRows, success: true });
        }
        catch (err) {
            res.json(err);
        }
    }
    static async pagination(req, res) {
        try {
            const params = req.body;
            var transactions = [];
            var totalRows = 0;
            var field = params.sortField;
            const patern = params.globalFilter;
            var columorder = "";
            const order = params.sortOrder;
            order == 1 ? (columorder = `${field}`) : (columorder = `-${field}`);
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            if (patern == null && field == null) {
                transactions = await transaccion_1.default.find().skip(params.first).limit(Number(params.rows)).populate("producto");
                totalRows = await transaccion_1.default.count();
            }
            else if (patern == null && field) {
                transactions = await transaccion_1.default.find().skip(params.first).limit(Number(params.rows)).sort(columorder).populate("producto");
                totalRows = await transaccion_1.default.count();
            }
            else if (patern && field == null) {
                const searchRgx = rgx(patern);
                transactions = await transaccion_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).skip(params.first).limit(Number(params.rows)).populate("producto");
                totalRows = await transaccion_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            else {
                const searchRgx = rgx(patern);
                transactions = await transaccion_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).skip(params.first).limit(Number(params.rows)).sort(columorder).populate("producto");
                totalRows = await transaccion_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            res.json({ transactions, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async createInput(req, res) {
        try {
            const body = req.body;
            var codigo = 1;
            const ultimocodigo = await transaccion_1.default.find().sort("-codigo").limit(1);
            if (ultimocodigo.length) {
                codigo = (ultimocodigo[0].codigo) + 1;
            }
            const transaccion = new transaccion_1.default({
                producto: body.productoid,
                codigo: codigo,
                preciounidad: body.preciounidad,
                cantidad: body.cantidad,
                factura: body.factura,
                area: "",
                cedula: "",
                fecha: body.fecha,
                descripcion: body.descripcion,
                tipo: "entrada",
            });
            const result = await transaccion.save();
            if (result) {
                const product = await product_1.default.findById(body.productoid);
                console.log(body.productoid);
                product.cantidad += body.cantidad;
                const resp = await product.save();
                res.status(201)
                    .json({ success: true, message: "Categoria creada correctamente" });
            }
            else {
                res
                    .status(201)
                    .json({ success: false, message: "A ocurrido un error intentelo mas tarde o pongase en contacto con el administrador" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async findByIds(req, res) {
        try {
            const transactions = await transaccion_1.default.find({
                _id: req.body.transactions
            }).populate("producto");
            if (transactions) {
                res
                    .status(201)
                    .json({ success: true, message: "Exito", transactions: transactions });
            }
            else {
                res
                    .json({ success: false, message: "No se encontraron transacciones" });
            }
        }
        catch (err) {
            res
                .json({ success: false, message: err.message });
        }
    }
    static async createOutput(req, res) {
        try {
            const body = req.body;
            var codigo = 1;
            const ultimocodigo = await transaccion_1.default.find().sort("-codigo").limit(1);
            if (ultimocodigo.length) {
                codigo = (ultimocodigo[0].codigo) + 1;
            }
            const transaccion = new transaccion_1.default({
                producto: body.productoid,
                codigo: codigo,
                preciounidad: body.preciounidad,
                cantidad: body.cantidad,
                factura: "",
                area: body.area,
                cedula: body.cedula,
                fecha: body.fecha,
                descripcion: body.descripcion,
                tipo: "salida",
            });
            const result = await transaccion.save();
            if (result) {
                const product = await product_1.default.findById(body.productoid);
                product.cantidad -= body.cantidad;
                const resp = await product.save();
                res
                    .status(201)
                    .json({ success: true, message: "Transaccion creada correctamente" });
            }
            else {
                res
                    .status(201)
                    .json({ success: false, message: "A ocurrido un error intentelo mas tarde o pongase en contacto con el administrador" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async show(req, res) {
        try {
            const id = req.params.id;
            const categoria = await transaccion_1.default.findById(id).populate("producto");
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
                const producto = await transaccion_1.default.findById(id);
                if (producto) {
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
                const eliminado = await transaccion_1.default.findById(id);
                if (eliminado) {
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
exports.default = TransaccionController;
