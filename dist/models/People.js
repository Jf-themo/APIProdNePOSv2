"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class People {
    /**
     * Constructor para inicializar los atributos de la clase User, incluyendo los de la clase base.
     *
     * @param {string} identification - Identificacion del usuario.
     * @param {string} namePerson - Nombre de la persona.
     * @param {string} lastName - Apellido de la persona.
     * @param {string} phone - Número de teléfono de la persona.
     */ constructor(identification, namePerson, lastName, phone) {
        this.identification = identification;
        this.namePerson = namePerson;
        this.lastName = lastName;
        this.phone = phone;
    }
    /**
     * Obtiene la identificacion del usuario.
     *
     * @returns {string} - identificacion del usuario.
     */
    getIdentification() {
        return this.identification;
    }
    /**
     * Obtiene el nombre de usuario.
     *
     * @returns {string} - Nombre de usuario.
     */
    getNamePerson() {
        return this.namePerson;
    }
    /**
     * Obtiene los apellidos del usuario.
     *
     * @returns {string} - apellidos del usuario.
     */
    getLastName() {
        return this.lastName;
    }
    /**
     * Obtiene el telefono del usuario.
     *
     * @returns {string} - telefono del usuario.
     */
    getPhone() {
        return this.phone;
    }
    // Métodos setter
    /**
     * Establece la identificacion del usuario.
     *
     * @param {string} identificacion - Nuevo ID del usuario.
     */
    setIdentification(identification) {
        this.identification = identification;
    }
    /**
     * Establece el nombre del usuario.
     *
     * @param {string} nombre - Nuevo ID del usuario.
     */
    setNamePerson(namePerson) {
        this.namePerson = namePerson;
    }
    /**
     * Establece los apellidos del usuario.
     *
     * @param {string} apellidos - Nuevo ID del usuario.
     */
    setLastName(lastName) {
        this.lastName = lastName;
    }
    /**
     * Establece el telefono del usuario.
     *
     * @param {string} telefono - Nuevo telefono del usuario.
     */
    setPhone(phone) {
        this.phone = phone;
    }
    /**
     * Devuelve una representación en forma de texto del objeto people.
     *
     * @returns {string} - Representación del objeto poeple en formato string.
     */
    toString() {
        return `Person [identification=${this.identification}, namePerson=${this.namePerson}, lastName=${this.lastName}, phone=${this.phone}]`;
    }
}
exports.default = People;
