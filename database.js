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
        //servidor en ubuntu prod
        //const respserver=await mongoose.connect("mongodb://root:admin123@144.126.133.247:27017/appstock?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");
        //mongodbatlas 
        // const reponse=await mongoose.connect(`mongodb+srv://admin:admin123@appstock.xcrnk.mongodb.net/appstock?retryWrites=true&w=majority`); 
        const response = await mongoose_1.default.connect(`mongodb://${config_1.default.MONGO_USER}:${config_1.default.MONGO_PASSWORD}@${config_1.default.MONGO_HOST}/${config_1.default.MONGO_DB}?authSource=admin`);
        // const reponse=await mongoose.connect(`mongodb+srv://admin:${config.MONGO_PASSWORD}@appstock.xcrnk.mongodb.net/${config.MONGO_DB}?retryWrites=true&w=majority`);  
    }
    catch (error) {
        console.error(error);
    }
})();
