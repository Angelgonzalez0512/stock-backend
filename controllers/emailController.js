"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailController {
    async main(actividad) {
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "pruebasenviocorreos05@gmail.com",
                pass: "Qwerty123!",
            },
        });
        let info = await transporter.sendMail({
            from: '"Actividad Finalizada 👩‍🦯" <angelgonzalezacevedo9@gmail.com>',
            to: "angelgonzalezacevedo9@gmail.com, angelgonzalezacevedo12@outlook.com",
            subject: `${actividad.nombre}`,
            text: `${actividad.nombre}`,
            html: "<b>La actividad a terminado ingrese a la pagina web para obtener mas detalles</b>",
        });
        return 1;
    }
}
exports.default = EmailController;
