"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaUnit = new mongoose_1.Schema({
    nombre: String,
    unidad: String,
    estado: {
        type: String,
        enum: ["activo", "baja"],
        default: "activo"
    }
}, {
    timestamps: false,
    versionKey: false
});
exports.default = mongoose_1.model("Unidad", schemaUnit);
