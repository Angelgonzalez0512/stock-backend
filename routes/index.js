"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const categoriaController_1 = __importDefault(require("../controllers/categoriaController"));
const productoController_1 = __importDefault(require("../controllers/productoController"));
const transaccionController_1 = __importDefault(require("../controllers/transaccionController"));
const ordenAlimentoController_1 = __importDefault(require("../controllers/ordenAlimentoController"));
const actividadController_1 = __importDefault(require("../controllers/actividadController"));
const areaController_1 = __importDefault(require("../controllers/areaController"));
const indicatorscontroller_1 = __importDefault(require("../controllers/indicatorscontroller"));
const unitController_1 = __importDefault(require("../controllers/unitController"));
const reportController_1 = __importDefault(require("../controllers/reportController"));
const router = express_1.Router();
//routes for users
router.post('/auth/user', userController_1.default.login);
router.get('/user', authMiddleware_1.default.Autenticate, userController_1.default.index);
router.post('/user', userController_1.default.create);
router.post('/user/paginate', userController_1.default.pagination);
router.post('/user/changepassword', authMiddleware_1.default.Autenticate, userController_1.default.editPassword);
router.put('/user/:id', userController_1.default.edit);
router.get('/user/:id', authMiddleware_1.default.Autenticate, userController_1.default.show);
router.delete('/user/:id', authMiddleware_1.default.Autenticate, userController_1.default.delete);
//areas
router.post("/area", areaController_1.default.create);
router.get("/area", areaController_1.default.index);
//routes for categories
router.get('/category', authMiddleware_1.default.Autenticate, categoriaController_1.default.index);
router.post('/category', categoriaController_1.default.create);
router.post('/category/paginate', categoriaController_1.default.pagination);
router.put('/category/:id', categoriaController_1.default.edit);
router.get('/category/:id', authMiddleware_1.default.Autenticate, categoriaController_1.default.show);
router.delete('/category/:id', authMiddleware_1.default.Autenticate, categoriaController_1.default.delete);
//routes for units
router.get('/unit', authMiddleware_1.default.Autenticate, unitController_1.default.index);
router.post('/unit', unitController_1.default.create);
router.get('/unit/:id', unitController_1.default.show);
router.put('/unit/:id', unitController_1.default.edit);
router.delete('/unit/:id', authMiddleware_1.default.Autenticate, unitController_1.default.delete);
//routes for products
router.get('/product', authMiddleware_1.default.Autenticate, productoController_1.default.index);
router.post('/product', productoController_1.default.create);
router.get("/product/alimentos", productoController_1.default.allForUser);
router.post('/product/paginate', productoController_1.default.pagination);
router.put('/product/:id', productoController_1.default.edit);
router.get('/product/:id', authMiddleware_1.default.Autenticate, productoController_1.default.show);
router.delete('/product/:id', authMiddleware_1.default.Autenticate, productoController_1.default.delete);
//routes for transactions
router.get('/transaction', authMiddleware_1.default.Autenticate, transaccionController_1.default.index);
router.post('/transaction', transaccionController_1.default.createInput);
router.post('/transaction/output', transaccionController_1.default.createOutput);
router.post('/transaction/paginate', transaccionController_1.default.pagination);
router.put('/transaction/:id', transaccionController_1.default.edit);
router.post('/transaction/details', transaccionController_1.default.findByIds);
router.get('/transaction/:id', authMiddleware_1.default.Autenticate, transaccionController_1.default.show);
router.delete('/transaction/:id', authMiddleware_1.default.Autenticate, transaccionController_1.default.delete);
//routes for orders food
router.get('/orderfoods', authMiddleware_1.default.Autenticate, ordenAlimentoController_1.default.index);
router.post('/orderfoods', ordenAlimentoController_1.default.create);
router.post('/orderfoods/paginate', ordenAlimentoController_1.default.pagination);
router.post('/orderfoods/end', ordenAlimentoController_1.default.finish);
router.put('/orderfoods/:id', ordenAlimentoController_1.default.edit);
router.get('/orderfoods/:id', authMiddleware_1.default.Autenticate, ordenAlimentoController_1.default.show);
router.delete('/orderfoods/:id', authMiddleware_1.default.Autenticate, ordenAlimentoController_1.default.delete);
//routes for order foods
router.get('/activity', authMiddleware_1.default.Autenticate, actividadController_1.default.index);
router.get('/activity/calendar', authMiddleware_1.default.Autenticate, actividadController_1.default.calendar);
router.post('/activity', actividadController_1.default.create);
router.post('/activity/paginate', actividadController_1.default.pagination);
router.post('/activity/transaction', actividadController_1.default.addTransaction);
router.post('/activity/transaction/delete', actividadController_1.default.deleteTransaction);
router.post('/activity/colaboradores', actividadController_1.default.updateColaborador);
router.put('/activity/:id', actividadController_1.default.edit);
router.get('/activity/:id', authMiddleware_1.default.Autenticate, actividadController_1.default.show);
router.delete('/activity/:id', authMiddleware_1.default.Autenticate, actividadController_1.default.delete);
//indicadores 
router.get("/indicator/home", indicatorscontroller_1.default.getIndicadoresHome);
router.get("/indicator/productbycategory", indicatorscontroller_1.default.getIndicadoresProductos);
router.get("/indicator/stock", indicatorscontroller_1.default.getIndicadoresTransacctions);
router.get("/indicator/ordersAndActivities", indicatorscontroller_1.default.getIndicadoresActivitiesAndOrders);
// reports
router.post("/report/user", reportController_1.default.reportUser);
router.post("/report/activity", reportController_1.default.reportActivity);
router.post("/report/orderFoods", reportController_1.default.reportOrderFoods);
router.post("/report/stock", reportController_1.default.reportTransactions);
router.post("/report/product", reportController_1.default.reportProducto);
exports.default = router;
