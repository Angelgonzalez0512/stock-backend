"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaProduct = new mongoose_1.Schema({
    codigo: String,
    nombre: String,
    cantidad: Number,
    unidad: String,
    precio: Number,
    categoria: String,
    estado: {
        type: String,
        enum: ['activo', 'baja'],
        default: "activo"
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.model("Producto", schemaProduct);
