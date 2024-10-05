"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const route = (0, express_1.Router)();
route.route("/list-all-user").get(userController_1.default.listUsers);
route.route("/create-user").post(userController_1.default.createUser);
route.route("/sing-in").post(userController_1.default.singIn);
exports.default = route;
