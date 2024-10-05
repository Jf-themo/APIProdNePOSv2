"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../controllers/index.controller");
const route = (0, express_1.Router)();
route.route("/").get(index_controller_1.index);
exports.default = route;
