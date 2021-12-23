"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaUser = new mongoose_1.Schema({
    nombres: String,
    apellidos: String,
    dni: {
        type: String,
        unique: true
    },
    correo: {
        type: String,
        unique: true
    },
    area: String,
    cedula: String,
    password: String,
    estado: {
        type: String,
        enum: ['activo', 'baja'],
        default: "activo"
    },
    rol: {
        type: String,
        enum: ['administrador', 'usuario'],
        default: "usuario"
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.default = mongoose_1.model("User", schemaUser);
