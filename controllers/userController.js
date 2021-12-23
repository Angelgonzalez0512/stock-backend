"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../schemas/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./../config"));
class UserController {
    static async index(req, res) {
        try {
            const skip = Number(req.query.pageIndex);
            let users;
            if (req.query.pageIndex && req.query.pageSize) {
                users = await user_1.default.find().skip(skip).limit(Number(req.query.pageSize));
            }
            else {
                users = await user_1.default.find();
            }
            const totalRows = await user_1.default.count();
            res.json({ users, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async pagination(req, res) {
        try {
            const params = req.body;
            var users = [];
            var totalRows = 0;
            var field = params.sortField;
            const patern = params.globalFilter;
            var columorder = "";
            const order = params.sortOrder;
            order == 1 ? columorder = `${field}` : columorder = `-${field}`;
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            if (patern == null && field == null) {
                users = await user_1.default.find().skip(params.first).limit(Number(params.rows));
                totalRows = await user_1.default.count();
            }
            else if (patern == null && field) {
                users = await user_1.default.find().skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await user_1.default.count();
            }
            else if (patern && field == null) {
                const searchRgx = rgx(patern);
                users = await user_1.default.find({
                    $or: [
                        { nombres: { $regex: searchRgx, $options: "i" } },
                        { apellidos: { $regex: searchRgx, $options: "i" } },
                        { area: { $regex: searchRgx, $options: "i" } },
                        { cedula: { $regex: searchRgx, $options: "i" } },
                        { dni: { $regex: searchRgx, $options: "i" } },
                        { correo: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } },
                        { rol: { $regex: searchRgx, $options: "i" } }
                    ],
                }).skip(params.first).limit(Number(params.rows));
                totalRows = await user_1.default.find({
                    $or: [
                        { nombres: { $regex: searchRgx, $options: "i" } },
                        { apellidos: { $regex: searchRgx, $options: "i" } },
                        { area: { $regex: searchRgx, $options: "i" } },
                        { cedula: { $regex: searchRgx, $options: "i" } },
                        { dni: { $regex: searchRgx, $options: "i" } },
                        { correo: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } },
                        { rol: { $regex: searchRgx, $options: "i" } }
                    ],
                }).count();
            }
            else {
                const searchRgx = rgx(patern);
                users = await user_1.default.find({ $or: [
                        { nombres: { $regex: searchRgx, $options: "i" } },
                        { apellidos: { $regex: searchRgx, $options: "i" } },
                        { area: { $regex: searchRgx, $options: "i" } },
                        { cedula: { $regex: searchRgx, $options: "i" } },
                        { dni: { $regex: searchRgx, $options: "i" } },
                        { correo: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } },
                        { rol: { $regex: searchRgx, $options: "i" } }
                    ], }).skip(params.first).limit(Number(params.rows)).sort(columorder);
                totalRows = await user_1.default.find({
                    $or: [
                        { nombres: { $regex: searchRgx, $options: "i" } },
                        { apellidos: { $regex: searchRgx, $options: "i" } },
                        { area: { $regex: searchRgx, $options: "i" } },
                        { cedula: { $regex: searchRgx, $options: "i" } },
                        { dni: { $regex: searchRgx, $options: "i" } },
                        { estado: { $regex: searchRgx, $options: "i" } },
                        { correo: { $regex: searchRgx, $options: "i" } },
                        { rol: { $regex: searchRgx, $options: "i" } }
                    ],
                }).count();
            }
            ;
            res.json({ users, totalRows, success: true });
        }
        catch (err) {
            res.json(err.message);
        }
    }
    static async create(req, res) {
        try {
            const userexists = await user_1.default.findOne({ dni: req.body.dni });
            if (userexists) {
                res.status(200).json({ success: false, message: "El usuario ya esta registrado" });
            }
            else {
                const body = req.body;
                const user = new user_1.default({
                    nombres: body.nombres,
                    apellidos: body.apellidos,
                    dni: body.dni,
                    correo: body.correo,
                    area: body.area,
                    cedula: body.cedula,
                    password: bcrypt_1.default.hashSync(body.password, 10),
                    estado: 'activo',
                    rol: body.rol
                });
                const saveuser = await user.save();
                res.status(201).json({ success: true, message: "Usuario Registrado correctamente" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
    static async show(req, res) {
        try {
            const id = req.params.id;
            const users = await user_1.default.findById(id);
            res.json(users);
        }
        catch (err) {
            res.json(null);
        }
    }
    static async edit(req, res) {
        try {
            const id = req.params.id;
            const userquery = req.body;
            if (id) {
                const user = await user_1.default.findById(id);
                if (user) {
                    user.nombres = userquery.nombres;
                    user.apellidos = userquery.apellidos;
                    user.dni = userquery.dni;
                    user.correo = userquery.correo;
                    user.area = userquery.area;
                    user.cedula = userquery.cedula;
                    user.estado = userquery.estado;
                    user.rol = userquery.rol;
                    if (userquery === null || userquery === void 0 ? void 0 : userquery.passwordnew) {
                        user.password = bcrypt_1.default.hashSync(userquery.passwordnew, 10);
                    }
                    user.save();
                    res.status(201).json({ success: true, message: "Usuario Actualizado correctamente" });
                }
                else {
                    res.status(200).json({ success: false, message: "El usuario no esta registrado" });
                }
            }
            else {
                res.status(200).json({ success: false, message: "Entrada invalida" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: "Entrada invalida", error: err });
        }
    }
    static async editPassword(req, res) {
        try {
            const userquery = req.body;
            const id = userquery._id;
            if (id) {
                const user = await user_1.default.findById(id);
                if (user) {
                    if (userquery === null || userquery === void 0 ? void 0 : userquery.passwordnew) {
                        user.password = bcrypt_1.default.hashSync(userquery.passwordnew, 10);
                    }
                    user.save();
                    res.status(201).json({ success: true, message: "Contraseña actualizada correctamente" });
                }
                else {
                    res.status(200).json({ success: false, message: "El usuario no esta registrado" });
                }
            }
            else {
                res.status(200).json({ success: false, message: "Entrada invalida" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: "Entrada invalida", error: err });
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params.id;
            if (id) {
                const eliminado = await user_1.default.findById(id);
                if (eliminado) {
                    eliminado.estado = "baja";
                    eliminado.save();
                    res.status(200).json({ success: true, message: "Usuario dado de baja correctamente" });
                }
                else {
                    res.status(200).json({ success: false, message: "No se pude dar de baja" });
                }
            }
            else {
                res.status(200).json({ success: false, message: "Entrada invalida" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err });
        }
    }
    static async login(req, res) {
        try {
            const user = req.body.correo;
            console.log(req.body);
            if (user) {
                const userexist = await user_1.default.findOne({ correo: user });
                if (userexist) {
                    const passwordvalid = await bcrypt_1.default.compare(req.body.password, userexist.password);
                    if (passwordvalid) {
                        const usersend = {
                            _id: userexist._id,
                            nombres: userexist.nombres,
                            apellidos: userexist.apellidos,
                            dni: userexist.dni,
                            correo: userexist.correo,
                            area: userexist.area,
                            cedula: userexist.cedula,
                            estado: userexist.estado,
                            rol: userexist.rol
                        };
                        const jwtoken = jsonwebtoken_1.default.sign({ _id: userexist._id, rol: usersend.rol }, config_1.default.TOKEN_SECRET_KEY, { expiresIn: config_1.default.TOKEN_EXPIRE });
                        res.status(200).json({ success: true, message: "Bienvenido", data: userexist, jwtoken });
                    }
                    else {
                        res.status(200).json({ success: false, message: "Contraseña incorrecta" });
                    }
                }
                else {
                    res.status(200).json({ success: false, message: "El usuario no esta registrado" });
                }
            }
            else {
                res.status(200).json({ success: false, message: "Entrada invalida" });
            }
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.default = UserController;
