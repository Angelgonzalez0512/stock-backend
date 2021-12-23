"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activity_1 = __importDefault(require("../schemas/activity"));
const product_1 = __importDefault(require("../schemas/product"));
const transaccion_1 = __importDefault(require("../schemas/transaccion"));
const mongoose_1 = require("mongoose");
const controlEstadosActividad_1 = __importDefault(require("./controlEstadosActividad"));
class ActivityController {
    static async index(req, res) {
        try {
            const skip = Number(req.query.pageIndex) * Number(req.query.pageSize);
            let activities;
            if (req.query.pageIndex && req.query.pageSize) {
                activities = await activity_1.default.find().skip(skip).limit(Number(req.query.pageSize));
            }
            else {
                activities = await activity_1.default.find();
            }
            const totalRows = await activity_1.default.count();
            res.json({ activities, totalRows, success: true });
        }
        catch (err) {
            res.json(err);
        }
    }
    static async updateColaborador(req, res) {
        try {
            const actividad = req.body;
            const activity = await activity_1.default.findById(actividad._id);
            if (activity) {
                activity.colaboradores = actividad.colaboradores;
                const result = await activity.save();
                if (result) {
                    res.json({ success: true, message: "Colaboradores actualizados correctamente", activity: result });
                }
                else {
                    res.json({ success: false, message: "No se a podido actualizar" });
                }
            }
            else {
                res.json({ success: false, message: "Actividad no valida" });
            }
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async addTransaction(req, res) {
        const session = await mongoose_1.startSession();
        session.startTransaction();
        try {
            const actividad = req.body.transaction;
            const id = req.body.id;
            const activity = await activity_1.default.findById(id);
            if (activity) {
                var codigo = 1;
                const ultimocodigo = await transaccion_1.default.find().sort("-codigo").limit(1);
                if (ultimocodigo.length) {
                    codigo = (ultimocodigo[0].codigo) + 1;
                }
                const transaccion = new transaccion_1.default({
                    producto: actividad.productoid,
                    codigo: codigo,
                    preciounidad: actividad.preciounidad,
                    cantidad: actividad.cantidad,
                    factura: "",
                    area: activity.area,
                    cedula: activity.cedula,
                    fecha: new Date(),
                    descripcion: activity.nombre,
                    tipo: "salida",
                });
                const savetransaccion = await transaccion.save();
                if (savetransaccion) {
                    const product = await product_1.default.findById(actividad.productoid);
                    product.cantidad -= actividad.cantidad;
                    const resp = await product.save();
                    let codtransacciones = activity.transacciones;
                    codtransacciones.push(transaccion._id);
                    activity.transacciones = codtransacciones;
                    const actividadsave = await activity.save();
                    await session.commitTransaction();
                    session.endSession();
                    if (actividadsave) {
                        res.json({ success: true, message: "Producto agregado correctamente", activity: actividadsave });
                    }
                    else {
                        res.json({ success: false, message: "No se a podido actualizar" });
                    }
                }
            }
            else {
                session.endSession();
                res.json({ success: false, message: "Actividad no valida" });
            }
        }
        catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.json({ success: false, message: err.message });
        }
    }
    static async deleteTransaction(req, res) {
        const session = await mongoose_1.startSession();
        session.startTransaction();
        try {
            const actividad = req.body.id;
            const id = req.body.transactionid;
            const activity = await activity_1.default.findById(actividad);
            if (activity) {
                const transaccion = await transaccion_1.default.findByIdAndDelete(id);
                if (transaccion) {
                    const product = await product_1.default.findById(transaccion.producto);
                    product.cantidad += transaccion.cantidad;
                    const resp = await product.save();
                    let codtransacciones = activity.transacciones;
                    codtransacciones = codtransacciones.filter((cod) => cod != id);
                    activity.transacciones = codtransacciones;
                    const actividadsave = await activity.save();
                    await session.commitTransaction();
                    session.endSession();
                    if (actividadsave) {
                        res.json({ success: true, message: "Producto eliminado correctamente", activity: actividadsave });
                    }
                    else {
                        res.json({ success: false, message: "No se a podido actualizar" });
                    }
                }
            }
            else {
                session.endSession();
                res.json({ success: false, message: "Actividad no valida" });
            }
        }
        catch (err) {
            await session.abortTransaction();
            session.endSession();
            res.json({ success: false, message: err.message });
        }
    }
    static async pagination(req, res) {
        try {
            const updatestates = new controlEstadosActividad_1.default();
            const afterbefore = await updatestates.verifyAndUpdate();
            const params = req.body;
            var activities = [];
            var totalRows = 0;
            var field = params.sortField;
            const patern = params.globalFilter;
            var columorder = "";
            const order = params.sortOrder;
            order == 1 ? (columorder = `${field}`) : (columorder = `-${field}`);
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            if (patern == null && field == null) {
                activities = await activity_1.default.find().skip(params.first).limit(Number(params.rows));
                totalRows = await activity_1.default.count();
            }
            else if (patern == null && field) {
                activities = await activity_1.default.find().skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await activity_1.default.count();
            }
            else if (patern && field == null) {
                const searchRgx = rgx(patern);
                activities = await activity_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                        { area: { $regex: searchRgx, options: "i" } }
                    ],
                }).skip(params.first).limit(Number(params.rows));
                totalRows = await activity_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            else {
                const searchRgx = rgx(patern);
                activities = await activity_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await activity_1.default.find({
                    $or: [
                        { tipo: { $regex: searchRgx, $options: "i" } },
                    ],
                }).count();
            }
            res.json({ activities, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async create(req, res) {
        try {
            const body = req.body;
            var codigo = 1;
            const ultimocodigo = await activity_1.default.find().sort("-codigo").limit(1);
            if (ultimocodigo.length) {
                codigo = (ultimocodigo[0].codigo) + 1;
            }
            const transaccion = new activity_1.default({
                codigo: codigo,
                nombre: body.nombre,
                usuario: body.usuarioid,
                transacciones: [],
                area: body.area,
                cedula: body.cedula,
                fechainicio: "",
                fechafin: "",
                descripcion: body.descripcion,
                estado: 'pendiente'
            });
            const result = await transaccion.save();
            if (result) {
                res
                    .status(201)
                    .json({ success: true, message: "Actividad creada correctamente" });
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
            const categoria = await activity_1.default.findById(id).populate("transacciones").populate("usuario", "nombres apellidos area cedula dni");
            res.json(categoria);
        }
        catch (err) {
            res.json(err);
        }
    }
    static async edit(req, res) {
        try {
            const id = req.params.id;
            const actividadquery = req.body;
            if (id) {
                const actividad = await activity_1.default.findById(id);
                if (actividad) {
                    actividad.area = actividadquery.area,
                        actividad.cedula = actividadquery.cedula,
                        actividad.fechainicio = actividadquery.fechainicio,
                        actividad.fechafin = actividadquery.fechafin;
                    actividad.descripcion = actividadquery.descripcion;
                    const responsesave = await actividad.save();
                    if (responsesave) {
                        res.status(201).json({
                            success: true,
                            activity: responsesave,
                            message: "Datos actualizados correctamente",
                        });
                    }
                    else {
                        res
                            .status(200)
                            .json({ success: false, message: "No se a podido actualizar" });
                    }
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
                .json({ success: false, message: err.message });
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            if (id) {
                const eliminado = await activity_1.default.findById(id);
                if (eliminado) {
                    if (eliminado.estado == "cancelado" || eliminado.estado == "terminado") {
                        res.json({ success: false, message: "Esta actividad no puede ser cancelada" });
                        return;
                    }
                    if (eliminado.transacciones.length) {
                        res.json({ success: false, message: "Esta actividad tiene productos agregados eliminine y vuelva a intentarlo" });
                        return;
                    }
                    eliminado.estado = "cancelado";
                    const save = await eliminado.save();
                    res
                        .status(200)
                        .json({ success: true, message: "Se a cancelado correctamente" });
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
                    .json({ success: false, message: "No se puede cancelar datos invalidos" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
    static async calendar(req, res) {
        try {
            const activities = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"] }).skip(0).limit(200).sort("-createdAt");
            const totalRows = activities.length;
            res.json({ activities, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
}
exports.default = ActivityController;
