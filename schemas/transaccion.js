"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaTransaction = new mongoose_1.Schema({
    producto: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Producto",
    },
    codigo: Number,
    preciounidad: Number,
    cantidad: Number,
    factura: String,
    area: {
        type: String,
        default: ""
    },
    cedula: {
        type: String,
        default: ""
    },
    fecha: Date,
    descripcion: String,
    tipo: {
        type: String,
        enum: ["entrada", "salida"],
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.model("Transaccion", schemaTransaction);
