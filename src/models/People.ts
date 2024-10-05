class People {
  // Definición de atributos privados
  private identification: string;
  private namePerson: string;
  private lastName: string;
  private phone: string;

  /**
   * Constructor para inicializar los atributos de la clase User, incluyendo los de la clase base.
   *
   * @param {string} identification - Identificacion del usuario.
   * @param {string} namePerson - Nombre de la persona.
   * @param {string} lastName - Apellido de la persona.
   * @param {string} phone - Número de teléfono de la persona.
   */ constructor(
    identification: string,
    namePerson: string,
    lastName: string,
    phone: string
  ) {
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
  public getIdentification(): string {
    return this.identification;
  }

  /**
   * Obtiene el nombre de usuario.
   *
   * @returns {string} - Nombre de usuario.
   */
  public getNamePerson(): string {
    return this.namePerson;
  }

  /**
   * Obtiene los apellidos del usuario.
   *
   * @returns {string} - apellidos del usuario.
   */
  public getLastName(): string {
    return this.lastName;
  }

  /**
   * Obtiene el telefono del usuario.
   *
   * @returns {string} - telefono del usuario.
   */
  public getPhone(): string {
    return this.phone;
  }

  // Métodos setter
  /**
   * Establece la identificacion del usuario.
   *
   * @param {string} identificacion - Nuevo ID del usuario.
   */
  public setIdentification(identification: string): void {
    this.identification = identification;
  }

  /**
   * Establece el nombre del usuario.
   *
   * @param {string} nombre - Nuevo ID del usuario.
   */
  public setNamePerson(namePerson: string): void {
    this.namePerson = namePerson;
  }

  /**
   * Establece los apellidos del usuario.
   *
   * @param {string} apellidos - Nuevo ID del usuario.
   */
  public setLastName(lastName: string): void {
    this.lastName = lastName;
  }

  /**
   * Establece el telefono del usuario.
   *
   * @param {string} telefono - Nuevo telefono del usuario.
   */
  public setPhone(phone: string): void {
    this.phone = phone;
  }

  /**
   * Devuelve una representación en forma de texto del objeto people.
   *
   * @returns {string} - Representación del objeto poeple en formato string.
   */
  public toString(): string {
    return `Person [identification=${this.identification}, namePerson=${this.namePerson}, lastName=${this.lastName}, phone=${this.phone}]`;
  }
}

export default People;
