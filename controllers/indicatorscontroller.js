"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activity_1 = __importDefault(require("../schemas/activity"));
const user_1 = __importDefault(require("../schemas/user"));
const transaccion_1 = __importDefault(require("../schemas/transaccion"));
const orderFood_1 = __importDefault(require("../schemas/orderFood"));
const product_1 = __importDefault(require("../schemas/product"));
const moment_1 = __importDefault(require("moment"));
const controlEstadosActividad_1 = __importDefault(require("./controlEstadosActividad"));
class IndicadoresController {
    static async getIndicadoresHome(req, res) {
        try {
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setpiembre", "Octubre", "Noviembre", "Diciembre"];
            const updatestates = new controlEstadosActividad_1.default();
            const afterbefore = await updatestates.verifyAndUpdate();
            const activities = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"] }).skip(0).limit(5).sort("-createdAt");
            const actividadterminadas = await activity_1.default.find({ "estado": "terminado" }).countDocuments();
            const actividadesdesarrollo = await activity_1.default.find({ "estado": "proceso" }).countDocuments();
            const usersAll = await user_1.default.countDocuments();
            const usersActives = await user_1.default.find({ "estado": "activo" }).countDocuments();
            const orderspendiente = await orderFood_1.default.find({ "estado": "pendiente" }).countDocuments();
            const ordersatentidas = await orderFood_1.default.find({ "estado": "atendido" }).countDocuments();
            const month1start = moment_1.default().subtract(6, "months").startOf("month").toDate();
            const month1end = moment_1.default().subtract(6, "months").endOf("month").toDate();
            const month2start = moment_1.default().subtract(5, "months").startOf("month").toDate();
            const month2end = moment_1.default().subtract(5, "months").endOf("month").toDate();
            const month3start = moment_1.default().subtract(4, "months").startOf("month").toDate();
            const month3end = moment_1.default().subtract(4, "months").endOf("month").toDate();
            const month4start = moment_1.default().subtract(3, "months").startOf("month").toDate();
            const month4end = moment_1.default().subtract(3, "months").endOf("month").toDate();
            const month5start = moment_1.default().subtract(2, "months").startOf("month").toDate();
            const month5end = moment_1.default().subtract(2, "months").endOf("month").toDate();
            const month6start = moment_1.default().subtract(1, "months").startOf("month").toDate();
            const month6end = moment_1.default().subtract(1, "months").endOf("month").toDate();
            const month7start = moment_1.default().startOf("month").toDate();
            const month7end = moment_1.default().endOf("month").toDate();
            const calcularTotal = (values) => {
                if (values.length) {
                    var total = 0;
                    values.forEach(value => {
                        total += (value.preciounidad * value.cantidad);
                    });
                    return total;
                }
                return 0;
            };
            const transactions1 = await transaccion_1.default.find({ createdAt: { $gte: month1start, $lte: month1end } });
            const transactions2 = await transaccion_1.default.find({ createdAt: { $gte: month2start, $lte: month2end } });
            const transactions3 = await transaccion_1.default.find({ createdAt: { $gte: month3start, $lte: month3end } });
            const transactions4 = await transaccion_1.default.find({ createdAt: { $gte: month4start, $lte: month4end } });
            const transactions5 = await transaccion_1.default.find({ createdAt: { $gte: month5start, $lte: month5end } });
            const transactions6 = await transaccion_1.default.find({ createdAt: { $gte: month6start, $lte: month6end } });
            const transactions7 = await transaccion_1.default.find({ createdAt: { $gte: month7start, $lte: month7end } });
            const transactionsmes1entrada = transactions1.filter((t) => t.tipo == "entrada");
            const transactionsmes2entrada = transactions2.filter((t) => t.tipo == "entrada");
            const transactionsmes3entrada = transactions3.filter((t) => t.tipo == "entrada");
            const transactionsmes4entrada = transactions4.filter((t) => t.tipo == "entrada");
            const transactionsmes5entrada = transactions5.filter((t) => t.tipo == "entrada");
            const transactionsmes6entrada = transactions6.filter((t) => t.tipo == "entrada");
            const transactionsmes7entrada = transactions7.filter((t) => t.tipo == "entrada");
            const transactionsmes1salida = transactions1.filter((t) => t.tipo == "salida");
            const transactionsmes2salida = transactions2.filter((t) => t.tipo == "salida");
            const transactionsmes3salida = transactions3.filter((t) => t.tipo == "salida");
            const transactionsmes4salida = transactions4.filter((t) => t.tipo == "salida");
            const transactionsmes5salida = transactions5.filter((t) => t.tipo == "salida");
            const transactionsmes6salida = transactions6.filter((t) => t.tipo == "salida");
            const transactionsmes7salida = transactions7.filter((t) => t.tipo == "salida");
            const ingresosalidames1 = calcularTotal(transactionsmes1salida);
            const ingresosalidames2 = calcularTotal(transactionsmes2salida);
            const ingresosalidames3 = calcularTotal(transactionsmes3salida);
            const ingresosalidames4 = calcularTotal(transactionsmes4salida);
            const ingresosalidames5 = calcularTotal(transactionsmes5salida);
            const ingresosalidames6 = calcularTotal(transactionsmes6salida);
            const ingresosalidames7 = calcularTotal(transactionsmes7salida);
            const ingresoentradames1 = calcularTotal(transactionsmes1entrada);
            const ingresoentradames2 = calcularTotal(transactionsmes2entrada);
            const ingresoentradames3 = calcularTotal(transactionsmes3entrada);
            const ingresoentradames4 = calcularTotal(transactionsmes4entrada);
            const ingresoentradames5 = calcularTotal(transactionsmes5entrada);
            const ingresoentradames6 = calcularTotal(transactionsmes6entrada);
            const ingresoentradames7 = calcularTotal(transactionsmes7entrada);
            const chartline = {
                salida: [ingresosalidames1, ingresosalidames2, ingresosalidames3, ingresosalidames4, ingresosalidames5, ingresosalidames6, ingresosalidames7],
                ingreso: [ingresoentradames1, ingresoentradames2, ingresoentradames3, ingresoentradames4, ingresoentradames5, ingresoentradames6, ingresoentradames7],
                labels: [meses[moment_1.default(month1start).month()], meses[moment_1.default(month2start).month()], meses[moment_1.default(month3start).month()], meses[moment_1.default(month4start).month()], meses[moment_1.default(month5start).month()], meses[moment_1.default(month6start).month()], meses[moment_1.default(month7start).month()]]
            };
            const targetas = {
                activities: {
                    terminadas: actividadterminadas,
                    desarrollo: actividadesdesarrollo
                },
                transactions: {
                    ingreso: ingresoentradames7,
                    salida: ingresosalidames7,
                    mes: meses[moment_1.default(month7start).month()]
                },
                users: {
                    activos: usersActives,
                    registrados: usersAll
                },
                orders: {
                    atendidos: ordersatentidas,
                    pendientes: orderspendiente
                }
            };
            res.json({ activities, targetas, chartline });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async getIndicadoresActivitiesAndOrders(req, res) {
        try {
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const month1start = moment_1.default().subtract(6, "months").startOf("month").toDate();
            const month1end = moment_1.default().subtract(6, "months").endOf("month").toDate();
            const month2start = moment_1.default().subtract(5, "months").startOf("month").toDate();
            const month2end = moment_1.default().subtract(5, "months").endOf("month").toDate();
            const month3start = moment_1.default().subtract(4, "months").startOf("month").toDate();
            const month3end = moment_1.default().subtract(4, "months").endOf("month").toDate();
            const month4start = moment_1.default().subtract(3, "months").startOf("month").toDate();
            const month4end = moment_1.default().subtract(3, "months").endOf("month").toDate();
            const month5start = moment_1.default().subtract(2, "months").startOf("month").toDate();
            const month5end = moment_1.default().subtract(2, "months").endOf("month").toDate();
            const month6start = moment_1.default().subtract(1, "months").startOf("month").toDate();
            const month6end = moment_1.default().subtract(1, "months").endOf("month").toDate();
            const month7start = moment_1.default().startOf("month").toDate();
            const month7end = moment_1.default().endOf("month").toDate();
            const activities1 = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"], $or: [{ fechainicio: { $gte: month1start, $lte: month1end }, fechafin: { $gte: month1start, $lte: month1end } }] }).countDocuments();
            const activities2 = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"], $or: [{ fechainicio: { $gte: month2start, $lte: month2end }, fechafin: { $gte: month2start, $lte: month2end } }] }).countDocuments();
            const activities3 = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"], $or: [{ fechainicio: { $gte: month3start, $lte: month3end }, fechafin: { $gte: month3start, $lte: month3end } }] }).countDocuments();
            const activities4 = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"], $or: [{ fechainicio: { $gte: month4start, $lte: month4end }, fechafin: { $gte: month4start, $lte: month4end } }] }).countDocuments();
            const activities5 = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"], $or: [{ fechainicio: { $gte: month5start, $lte: month5end }, fechafin: { $gte: month5start, $lte: month5end } }] }).countDocuments();
            const activities6 = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"], $or: [{ fechainicio: { $gte: month6start, $lte: month6end }, fechafin: { $gte: month6start, $lte: month6end } }] }).countDocuments();
            const activities7 = await activity_1.default.find({ estado: ["pendiente", "proceso", "terminado"], $or: [{ fechainicio: { $gte: month7start, $lte: month7end }, fechafin: { $gte: month7start, $lte: month7end } }] }).countDocuments();
            const orders1 = await orderFood_1.default.find({ fecha: { $gte: month1start, $lte: month1end }, estado: ["atendido", "pendiente"] }).countDocuments();
            const orders2 = await orderFood_1.default.find({ fecha: { $gte: month2start, $lte: month2end }, estado: ["atendido", "pendiente"] }).countDocuments();
            const orders3 = await orderFood_1.default.find({ fecha: { $gte: month3start, $lte: month3end }, estado: ["atendido", "pendiente"] }).countDocuments();
            const orders4 = await orderFood_1.default.find({ fecha: { $gte: month4start, $lte: month4end }, estado: ["atendido", "pendiente"] }).countDocuments();
            const orders5 = await orderFood_1.default.find({ fecha: { $gte: month5start, $lte: month5end }, estado: ["atendido", "pendiente"] }).countDocuments();
            const orders6 = await orderFood_1.default.find({ fecha: { $gte: month6start, $lte: month6end }, estado: ["atendido", "pendiente"] }).countDocuments();
            const orders7 = await orderFood_1.default.find({ fecha: { $gte: month7start, $lte: month7end }, estado: ["atendido", "pendiente"] }).countDocuments();
            const chart = {
                activities: [activities1, activities2, activities3, activities4, activities5, activities6, activities7],
                orders: [orders1, orders2, orders3, orders4, orders5, orders6, orders7],
                labels: [meses[moment_1.default(month1start).month()], meses[moment_1.default(month2start).month()], meses[moment_1.default(month3start).month()], meses[moment_1.default(month4start).month()], meses[moment_1.default(month5start).month()], meses[moment_1.default(month6start).month()], meses[moment_1.default(month7start).month()]]
            };
            res.json({ chart });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async getIndicadoresTransacctions(req, res) {
        try {
            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const month1start = moment_1.default().subtract(6, "months").startOf("month").toDate();
            const month1end = moment_1.default().subtract(6, "months").endOf("month").toDate();
            const month2start = moment_1.default().subtract(5, "months").startOf("month").toDate();
            const month2end = moment_1.default().subtract(5, "months").endOf("month").toDate();
            const month3start = moment_1.default().subtract(4, "months").startOf("month").toDate();
            const month3end = moment_1.default().subtract(4, "months").endOf("month").toDate();
            const month4start = moment_1.default().subtract(3, "months").startOf("month").toDate();
            const month4end = moment_1.default().subtract(3, "months").endOf("month").toDate();
            const month5start = moment_1.default().subtract(2, "months").startOf("month").toDate();
            const month5end = moment_1.default().subtract(2, "months").endOf("month").toDate();
            const month6start = moment_1.default().subtract(1, "months").startOf("month").toDate();
            const month6end = moment_1.default().subtract(1, "months").endOf("month").toDate();
            const month7start = moment_1.default().startOf("month").toDate();
            const month7end = moment_1.default().endOf("month").toDate();
            const calcularTotal = (values) => {
                if (values.length) {
                    var total = 0;
                    values.forEach(value => {
                        total += (value.preciounidad * value.cantidad);
                    });
                    return total;
                }
                return 0;
            };
            const transactions1 = await transaccion_1.default.find({ createdAt: { $gte: month1start, $lte: month1end } });
            const transactions2 = await transaccion_1.default.find({ createdAt: { $gte: month2start, $lte: month2end } });
            const transactions3 = await transaccion_1.default.find({ createdAt: { $gte: month3start, $lte: month3end } });
            const transactions4 = await transaccion_1.default.find({ createdAt: { $gte: month4start, $lte: month4end } });
            const transactions5 = await transaccion_1.default.find({ createdAt: { $gte: month5start, $lte: month5end } });
            const transactions6 = await transaccion_1.default.find({ createdAt: { $gte: month6start, $lte: month6end } });
            const transactions7 = await transaccion_1.default.find({ createdAt: { $gte: month7start, $lte: month7end } });
            const transactionsmes1entrada = transactions1.filter((t) => t.tipo == "entrada");
            const transactionsmes2entrada = transactions2.filter((t) => t.tipo == "entrada");
            const transactionsmes3entrada = transactions3.filter((t) => t.tipo == "entrada");
            const transactionsmes4entrada = transactions4.filter((t) => t.tipo == "entrada");
            const transactionsmes5entrada = transactions5.filter((t) => t.tipo == "entrada");
            const transactionsmes6entrada = transactions6.filter((t) => t.tipo == "entrada");
            const transactionsmes7entrada = transactions7.filter((t) => t.tipo == "entrada");
            const transactionsmes1salida = transactions1.filter((t) => t.tipo == "salida");
            const transactionsmes2salida = transactions2.filter((t) => t.tipo == "salida");
            const transactionsmes3salida = transactions3.filter((t) => t.tipo == "salida");
            const transactionsmes4salida = transactions4.filter((t) => t.tipo == "salida");
            const transactionsmes5salida = transactions5.filter((t) => t.tipo == "salida");
            const transactionsmes6salida = transactions6.filter((t) => t.tipo == "salida");
            const transactionsmes7salida = transactions7.filter((t) => t.tipo == "salida");
            const ingresosalidames1 = calcularTotal(transactionsmes1salida);
            const ingresosalidames2 = calcularTotal(transactionsmes2salida);
            const ingresosalidames3 = calcularTotal(transactionsmes3salida);
            const ingresosalidames4 = calcularTotal(transactionsmes4salida);
            const ingresosalidames5 = calcularTotal(transactionsmes5salida);
            const ingresosalidames6 = calcularTotal(transactionsmes6salida);
            const ingresosalidames7 = calcularTotal(transactionsmes7salida);
            const ingresoentradames1 = calcularTotal(transactionsmes1entrada);
            const ingresoentradames2 = calcularTotal(transactionsmes2entrada);
            const ingresoentradames3 = calcularTotal(transactionsmes3entrada);
            const ingresoentradames4 = calcularTotal(transactionsmes4entrada);
            const ingresoentradames5 = calcularTotal(transactionsmes5entrada);
            const ingresoentradames6 = calcularTotal(transactionsmes6entrada);
            const ingresoentradames7 = calcularTotal(transactionsmes7entrada);
            const chart = {
                salida: [ingresosalidames1, ingresosalidames2, ingresosalidames3, ingresosalidames4, ingresosalidames5, ingresosalidames6, ingresosalidames7],
                ingreso: [ingresoentradames1, ingresoentradames2, ingresoentradames3, ingresoentradames4, ingresoentradames5, ingresoentradames6, ingresoentradames7],
                labels: [meses[moment_1.default(month1start).month()], meses[moment_1.default(month2start).month()], meses[moment_1.default(month3start).month()], meses[moment_1.default(month4start).month()], meses[moment_1.default(month5start).month()], meses[moment_1.default(month6start).month()], meses[moment_1.default(month7start).month()]]
            };
            res.json({ chart });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
    static async getIndicadoresProductos(req, res) {
        try {
            const productos = await product_1.default.aggregate([
                { $group: { _id: "$categoria", cantidad: { $count: {} } }
                },
                {
                    $sort: { cantidad: -1 }
                },
                {
                    $limit: 6
                }
            ]);
            var data = [];
            var labels = [];
            productos.forEach((p) => {
                data.push(p.cantidad);
                labels.push(p._id);
            });
            const chart = { data, labels };
            res.json({ chart });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    }
}
exports.default = IndicadoresController;
