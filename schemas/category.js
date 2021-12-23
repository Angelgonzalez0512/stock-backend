"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SchemaCategory = new mongoose_1.Schema({
    denominacion: String,
    estado: {
        type: String,
        enum: ['activo', 'baja'],
        default: "activo"
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.default = mongoose_1.model("Categoria", SchemaCategory);
