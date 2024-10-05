"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnyEmptyOrNull = void 0;
const isAnyEmptyOrNull = (object) => {
    console.log({
        object,
    });
    for (let item in object) {
        if (!object[item]) {
            console.log(`El atributo ${object[item]} esta implicitamente falso`);
            return true;
        }
        return false;
    }
};
exports.isAnyEmptyOrNull = isAnyEmptyOrNull;
