"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaArea = new mongoose_1.Schema({
    area: String,
    cedulas: [String]
}, {
    versionKey: false,
    timestamps: true
});
exports.default = mongoose_1.model("Area", schemaArea);
