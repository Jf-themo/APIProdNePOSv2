import People from "../models/People";

/**
 * Clase User que extiende de la clase People.
 * Representa a un usuario con sus atributos específicos y métodos de gestión.
 *
 * @class
 * @extends People
 */
class User extends People {
  // Definición de atributos privados
  private id: string;
  private userName: string;
  private passCode: string;
  private userRole: string;

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
  constructor(
    id: string,
    identification: string,
    namePerson: string,
    lastName: string,
    phone: string,
    userName: string,
    passCode: string,
    userRole: string
  ) {
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
  public getId(): string {
    return this.id;
  }

  /**
   * Obtiene el nombre del usuario.
   *
   * @returns {string} - nombre del usuario.
   */
  public getUserName(): string {
    return this.userName;
  }

  /**
   * Obtiene la contrasena del usuario.
   *
   * @returns {string} - contrasena del usuario.
   */
  public getPassCode(): string {
    return this.passCode;
  }

  /**
   * Obtiene el rol del usuario.
   *
   * @returns {string} - rol del usuario.
   */
  public getUserRole(): string {
    return this.userRole;
  }

  // Métodos setter
  /**
   * Establece el id del usuario.
   *
   * @param {string} id - Nuevo ID del usuario.
   */
  public setId(id: string): void {
    this.id = id;
  }

  /**
   * Establece el nombre del usuario.
   *
   * @param {string} nombre - Nuevo ID del usuario.
   */
  public setUserName(userName: string): void {
    this.userName = userName;
  }

  /**
   * Establece la contrasena del usuario.
   *
   * @param {string} contrasena - Nuevo ID del usuario.
   */
  public setPassCode(passCode: string): void {
    this.passCode = passCode;
  }

  /**
   * Establece el rol del usuario.
   *
   * @param {string} identificacion - Nuevo ID del usuario.
   */
  public setUserRole(userRole: string): void {
    this.userRole = userRole;
  }

  /**
   * Devuelve una representación en forma de texto del objeto people.
   *
   * @returns {string} - Representación del objeto user en formato string.
   */ public toString(): string {
    return `User [id=${
      this.id
    }, identification=${this.getIdentification()}, namePerson=${this.getNamePerson()}, lastName=${this.getLastName()}, phone=${this.getPhone()}, userName=${
      this.userName
    }, userRole=${this.userRole}]`;
  }

  /**
   * Devuelve una valor booleano dependiendo si los atributos del usuario estan implicitamente falso.
   *
   * @returns {boolean} - true o false dependiendo si el atributo esta implicitamente falso o no
   */ public isAnyEmptyOrNull(): boolean {
    return (
      !this.userName ||
      !this.passCode ||
      !this.userRole ||
      !this.getIdentification() ||
      !this.getNamePerson() ||
      !this.getLastName() ||
      !this.getPhone()
    );
  }
}

export default User;
