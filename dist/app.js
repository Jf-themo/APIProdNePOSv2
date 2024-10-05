"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cors_1 = __importDefault(require("cors"));
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port || process.env.PORT || 3000;
        this.app.use(express_1.default.json());
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)()); // Permitir peticiones de cualquier origen
    }
    routes() {
        this.app.use(user_routes_1.default);
        this.app.use(auth_routes_1.default);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.port);
            console.log("Server on port", this.port);
        });
    }
}
exports.App = App;
