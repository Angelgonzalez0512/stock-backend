"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderFood_1 = __importDefault(require("../schemas/orderFood"));
const product_1 = __importDefault(require("../schemas/product"));
const transaccion_1 = __importDefault(require("../schemas/transaccion"));
class OrdenAlimentoController {
    static async index(req, res) {
        try {
            const skip = Number(req.query.pageIndex) * Number(req.query.pageSize);
            let ordersfood;
            if (req.query.pageIndex && req.query.pageSize) {
                ordersfood = await orderFood_1.default.find().skip(skip).limit(Number(req.query.pageSize));
            }
            else {
                ordersfood = await orderFood_1.default.find();
            }
            const totalRows = await orderFood_1.default.count();
            res.json({ ordersfood, totalRows, success: true });
        }
        catch (err) {
            res.json(err);
        }
    }
    static async pagination(req, res) {
        try {
            const params = req.body;
            var ordersfoods = [];
            var totalRows = 0;
            var field = params.sortField;
            const patern = params.globalFilter;
            var columorder = "";
            const order = params.sortOrder;
            order == 1 ? (columorder = `${field}`) : (columorder = `-${field}`);
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            if (patern == null && field == null) {
                ordersfoods = await orderFood_1.default.find().skip(params.first).limit(Number(params.rows));
                totalRows = await orderFood_1.default.count();
            }
            else if (patern == null && field) {
                ordersfoods = await orderFood_1.default.find().skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await orderFood_1.default.count();
            }
            else if (patern && field == null) {
                const searchRgx = rgx(patern);
                ordersfoods = await orderFood_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).skip(params.first).limit(Number(params.rows));
                totalRows = await orderFood_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            else {
                const searchRgx = rgx(patern);
                ordersfoods = await orderFood_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await orderFood_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            res.json({ ordersfoods, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async create(req, res) {
        try {
            const body = req.body;
            const beforecode = await orderFood_1.default.find().sort("-codigo").limit(1);
            var code = 1;
            if (beforecode) {
                if (beforecode.length) {
                    code = beforecode[0].codigo + 1;
                }
            }
            if (!body.usuarioid) {
                res.json({ success: false, message: "No se a podido crear tu orden intentelo mas tarde" });
                return;
            }
            const ordenalimento = new orderFood_1.default({
                codigo: code,
                usuario: body.usuarioid,
                detalles: body.detalles,
                transaciones: [],
                area: body.area,
                cedula: body.cedula,
                fecha: new Date(),
                descripcion: body.descripcion,
                otrosproductos: body.otrosproductos,
                estado: "pendiente"
            });
            const result = await ordenalimento.save();
            if (result) {
                res
                    .status(201)
                    .json({ success: true, message: "Pedido realizado correctamente" });
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
            const categoria = await orderFood_1.default.findById(id).populate("usuario", "nombres apellidos area cedula dni").populate("detalles.producto");
            res.json(categoria);
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async edit(req, res) {
        try {
            const id = req.params.id;
            const productoquery = req.body;
            if (id) {
                const producto = await orderFood_1.default.findById(id);
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
                const eliminado = await orderFood_1.default.findById(id);
                if (eliminado) {
                    if (eliminado.estado == "atendido" || eliminado.estado == "cancelado") {
                        res
                            .status(200)
                            .json({ success: false, message: "No se puede cancelar esta orden" });
                        return;
                    }
                    eliminado.estado = "cancelado";
                    const save = await eliminado.save();
                    res
                        .status(200)
                        .json({ success: true, message: "Cancelado correctamente" });
                }
                else {
                    res
                        .status(200)
                        .json({ success: false, message: "No se puede cancelar" });
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
    static async finish(req, res) {
        var _a;
        const session = await mongoose_1.startSession();
        session.startTransaction();
        try {
            const order = (_a = req.body) === null || _a === void 0 ? void 0 : _a.order;
            const booltransactions = req.body.transaction;
            if (order) {
                const orden = await orderFood_1.default.findById(order._id);
                if (orden) {
                    if (order.estado == "atendido") {
                        session.endSession();
                        res.json({ success: false, message: "Esta orden no se puede editar" });
                        return;
                    }
                    orden.estado = "atendido";
                    if (booltransactions) {
                        var nuevastransacciones = [];
                        if (orden.detalles.length) {
                            for (let i = 0; i < orden.detalles.length; i++) {
                                var codigo = 1;
                                const ultimocodigo = await transaccion_1.default.find().sort("-codigo").limit(1);
                                if (ultimocodigo.length) {
                                    codigo = (ultimocodigo[0].codigo) + 1;
                                }
                                const product = await product_1.default.findById(orden.detalles[i].producto);
                                const transaccion = new transaccion_1.default({
                                    producto: orden.detalles[i].producto,
                                    codigo: codigo,
                                    preciounidad: product.precio,
                                    cantidad: orden.detalles[i].cantidad,
                                    factura: "",
                                    area: orden.area,
                                    cedula: orden.cedula,
                                    fecha: new Date(),
                                    descripcion: "pedido alimentos area " + orden.area,
                                    tipo: "salida",
                                });
                                const savetransaccion = await transaccion.save();
                                if (savetransaccion) {
                                    product.cantidad -= orden.detalles[i].cantidad;
                                    const resp = await product.save();
                                    nuevastransacciones.push(savetransaccion._id);
                                }
                            }
                        }
                        orden.transaciones = nuevastransacciones;
                    }
                    const saveorder = await orden.save();
                    if (saveorder) {
                        const savecommit = await session.commitTransaction();
                        session.endSession();
                        res.json({ success: true, message: "La orden a sido finalizada" });
                    }
                    else {
                        await session.abortTransaction();
                        session.endSession();
                        res.json({ success: false, message: "Error al intentar finalizar" });
                    }
                }
                else {
                    session.endSession();
                    res.json({ success: false, message: "Orden no encontrada" });
                }
            }
            else {
                session.endSession();
                res.json({ success: false, message: "Orden no enviada" });
            }
        }
        catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.json({ success: false, message: err.message });
        }
    }
}
exports.default = OrdenAlimentoController;
