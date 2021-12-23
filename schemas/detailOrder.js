"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaOrderDetail = new mongoose_1.Schema({
    producto: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Producto"
    },
    cantidad: Number,
    estado: {
        type: String,
        enum: ["pendiente", "aprobado"],
        required: true,
        default: "pendiente"
    }
}, {
    timestamps: false,
    versionKey: false
});
exports.default = schemaOrderDetail;
