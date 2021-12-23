"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaActivity = new mongoose_1.Schema({
    codigo: Number,
    nombre: String,
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    transacciones: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Transaccion"
    },
    area: String,
    cedula: String,
    fechainicio: Date,
    fechafin: Date,
    descripcion: String,
    colaboradores: {
        type: []
    },
    estado: {
        type: String,
        enum: ["pendiente", "proceso", "terminado", "cancelado"],
        default: "pendiente"
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.model("Actividad", schemaActivity);
