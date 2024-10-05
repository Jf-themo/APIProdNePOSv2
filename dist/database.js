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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
const promise_1 = require("mysql2/promise");
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = (0, promise_1.createPool)({
            host: "bo8yioelucnyneouuyof-mysql.services.clever-cloud.com",
            user: "uzmp52tau5tlkfqt",
            port: 3306,
            database: "bo8yioelucnyneouuyof",
            password: "eZeGT8C5JWTINxNB9Wr7",
            // host: "localhost",
            // user: "root",
            // port: 3306,
            // database: "corpocesar",
            // password: "1065828184",
        });
        return connection;
    });
}
