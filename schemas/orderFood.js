"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const detailOrder_1 = __importDefault(require("./detailOrder"));
const schemaOrderFood = new mongoose_1.Schema({
    codigo: Number,
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    detalles: {
        type: [detailOrder_1.default]
    },
    transaciones: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Transaccion"
    },
    area: String,
    cedula: String,
    fecha: Date,
    descripcion: String,
    otrosproductos: {
        type: []
    },
    estado: {
        type: String,
        enum: ["pendiente", "atendido", "cancelado"],
        default: "pendiente"
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.model("OrdenAlimento", schemaOrderFood);
