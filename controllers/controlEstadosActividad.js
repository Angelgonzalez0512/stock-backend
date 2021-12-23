"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const activity_1 = __importDefault(require("../schemas/activity"));
const moment_1 = __importDefault(require("moment"));
const emailController_1 = __importDefault(require("./emailController"));
class ControlEstadosActividad {
    async verifyAndUpdate() {
        try {
            const activities = await activity_1.default.find({ estado: ["pendiente", "proceso"] });
            if (activities.length) {
                for (var i = 0; i < activities.length; i++) {
                    if (activities[i].fechainicio && activities[i].fechafin) {
                        if (activities[i].estado == "pendiente") {
                            if (moment_1.default(activities[i].fechainicio).diff(new Date()) < 0) {
                                var actividad = await activity_1.default.findById(activities[i]._id);
                                if (actividad) {
                                    actividad.estado = "proceso";
                                    const save = await actividad.save();
                                }
                            }
                        }
                        else {
                            if (moment_1.default(activities[i].fechafin).diff(new Date()) < 0) {
                                var actividad = await activity_1.default.findById(activities[i]._id);
                                if (actividad) {
                                    actividad.estado = "terminado";
                                    try {
                                        const email = new emailController_1.default();
                                        const send = await email.main(actividad);
                                    }
                                    catch (err) {
                                    }
                                    const save = await actividad.save();
                                }
                            }
                        }
                    }
                }
            }
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        }
        catch (err) {
            return new Promise((resolve, reject) => reject(false));
        }
    }
}
exports.default = ControlEstadosActividad;
