"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const People_1 = __importDefault(require("../models/People"));
/**
 * Clase User que extiende de la clase People.
 * Representa a un usuario con sus atributos específicos y métodos de gestión.
 *
 * @class
 * @extends People
 */
class User extends People_1.default {
    /**
     * Constructor para inicializar los atributos de la clase User, incluyendo los de la clase base.
     *
     * @param {string} id - Identificador único del usuario.
     * @param {string} identification - Identificación de la persona.
     * @param {string} namePerson - Nombre de la persona.
     * @param {string} lastName - Apellido de la persona.
     * @param {string} phone - Número de teléfono de la persona.
     * @param {string} userName - Nombre de usuario.
     * @param {string} passCode - Contraseña del usuario.
     * @param {string} userRole - Rol del usuario.
     */
    constructor(id, identification, namePerson, lastName, phone, userName, passCode, userRole) {
        super(identification, namePerson, lastName, phone); // Llama al constructor de la clase base (Person)
        this.id = id;
        this.userName = userName;
        this.passCode = passCode;
        this.userRole = userRole;
    }
    // Métodos getter
    /**
     * Obtiene la el id del usuario.
     *
     * @returns {string} - id del usuario.
     */
    getId() {
        return this.id;
    }
    /**
     * Obtiene el nombre del usuario.
     *
     * @returns {string} - nombre del usuario.
     */
    getUserName() {
        return this.userName;
    }
    /**
     * Obtiene la contrasena del usuario.
     *
     * @returns {string} - contrasena del usuario.
     */
    getPassCode() {
        return this.passCode;
    }
    /**
     * Obtiene el rol del usuario.
     *
     * @returns {string} - rol del usuario.
     */
    getUserRole() {
        return this.userRole;
    }
    // Métodos setter
    /**
     * Establece el id del usuario.
     *
     * @param {string} id - Nuevo ID del usuario.
     */
    setId(id) {
        this.id = id;
    }
    /**
     * Establece el nombre del usuario.
     *
     * @param {string} nombre - Nuevo ID del usuario.
     */
    setUserName(userName) {
        this.userName = userName;
    }
    /**
     * Establece la contrasena del usuario.
     *
     * @param {string} contrasena - Nuevo ID del usuario.
     */
    setPassCode(passCode) {
        this.passCode = passCode;
    }
    /**
     * Establece el rol del usuario.
     *
     * @param {string} identificacion - Nuevo ID del usuario.
     */
    setUserRole(userRole) {
        this.userRole = userRole;
    }
    /**
     * Devuelve una representación en forma de texto del objeto people.
     *
     * @returns {string} - Representación del objeto user en formato string.
     */ toString() {
        return `User [id=${this.id}, identification=${this.getIdentification()}, namePerson=${this.getNamePerson()}, lastName=${this.getLastName()}, phone=${this.getPhone()}, userName=${this.userName}, userRole=${this.userRole}]`;
    }
    /**
     * Devuelve una valor booleano dependiendo si los atributos del usuario estan implicitamente falso.
     *
     * @returns {boolean} - true o false dependiendo si el atributo esta implicitamente falso o no
     */ isAnyEmptyOrNull() {
        return (!this.userName ||
            !this.passCode ||
            !this.userRole ||
            !this.getIdentification() ||
            !this.getNamePerson() ||
            !this.getLastName() ||
            !this.getPhone());
    }
}
exports.default = User;
