/**
 * Verifica si alguna de las variables de entorno requeridas está vacía o es nula.
 *
 * @function isAnyEmptyOrNull
 * @returns {boolean} Retorna `true` si alguna de las variables de entorno requeridas está vacía o es nula; de lo contrario, retorna `false`.
 *
 * @example
 * if (isAnyEmptyOrNull()) {
 *   console.error('Una o más variables de entorno están vacías o son null.');
 * } else {
 *   console.log('Todas las variables de entorno están configuradas correctamente.');
 * }
 */
const isAnyEmptyOrNull = () => {
  const requiredEnvVars = [
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.USER,
    process.env.PASSWORD,
  ];
  console.log(requiredEnvVars);

  return requiredEnvVars.some((varValue) => !varValue);
};

export { isAnyEmptyOrNull };
