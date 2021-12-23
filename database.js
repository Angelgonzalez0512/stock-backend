"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
(async () => {
    try {
        mongoose_1.default.set("useUnifiedTopology", true);
        mongoose_1.default.set('useNewUrlParser', true);
        mongoose_1.default.set('useFindAndModify', false);
        mongoose_1.default.set('useCreateIndex', true);
       const response = await mongoose_1.default.connect(`mongodb://${config_1.default.MONGO_USER}:${config_1.default.MONGO_PASSWORD}@${config_1.default.MONGO_HOST}/${config_1.default.MONGO_DB}?authSource=admin`);
   }
    catch (error) {
        console.error(error);
    }
})();
