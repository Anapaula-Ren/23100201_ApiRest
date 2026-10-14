/**
 * Funciones para calcular áreas de figuras geométricas.
 * @module Figuras
 */

/**
 * Comprueba que una medida sea un número finito y no negativo.
 * @private
 * @param {number} valor - Medida que se va a comprobar.
 * @param {string} nombre - Nombre de la medida para el mensaje de error.
 * @throws {TypeError} Si el valor no es un número finito.
 * @throws {RangeError} Si el valor es negativo.
 */
function validarMedida(valor, nombre) {
    if (typeof valor !== "number" || !Number.isFinite(valor)) {
        throw new TypeError(`${nombre} debe ser un número finito.`);
    }
    if (valor < 0) {
        throw new RangeError(`${nombre} no puede ser negativo.`);
    }
}

/**
 * Calcula el área de un triángulo.
 * @function areaTriangulo
 * @author Anapaula-Ren
 * @param {number} base - Longitud de la base del triángulo.
 * @param {number} altura - Longitud de la altura del triángulo.
 * @returns {number} Área del triángulo en unidades cuadradas.
 * @throws {TypeError} Si la base o la altura no son números finitos.
 * @throws {RangeError} Si la base o la altura son negativas.
 * @version 1.0.0
 * @since 1.0.0
 * @example
 * areaTriangulo(4, 3); // 6
 */
export function areaTriangulo(base, altura) {
    validarMedida(base, "La base");
    validarMedida(altura, "La altura");
    return (base * altura) / 2;
}

/**
 * Calcula el área de un cuadrado.
 * @function areCuadrado
 * @author Anapaula-Ren
 * @param {number} lado - Longitud de uno de los lados del cuadrado.
 * @returns {number} Área del cuadrado en unidades cuadradas.
 * @throws {TypeError} Si el lado no es un número finito.
 * @throws {RangeError} Si el lado es negativo.
 * @version 1.0.0
 * @since 1.0.0
 * @example
 * areCuadrado(5); // 25
 */
export function areCuadrado(lado) {
    validarMedida(lado, "El lado");
    return lado * lado;
}

/**
 * Calcula el área de un círculo.
 * @function areaCirculo
 * @author Anapaula-Ren
 * @param {number} radio - Longitud del radio del círculo.
 * @returns {number} Área del círculo en unidades cuadradas.
 * @throws {TypeError} Si el radio no es un número finito.
 * @throws {RangeError} Si el radio es negativo.
 * @version 1.0.0
 * @since 1.0.0
 * @example
 * areaCirculo(2); // aproximadamente 12.566370614359172
 */
export function areaCirculo(radio) {
    validarMedida(radio, "El radio");
    return Math.PI * Math.pow(radio, 2);
}

/**
 * Calcula el área de un rectángulo.
 * @function areaRectangulo
 * @author Anapaula-Ren
 * @param {number} ladoA - Longitud de uno de los lados del rectángulo.
 * @param {number} ladoB - Longitud del otro lado del rectángulo.
 * @returns {number} Área del rectángulo en unidades cuadradas.
 * @throws {TypeError} Si alguno de los lados no es un número finito.
 * @throws {RangeError} Si alguno de los lados es negativo.
 * @version 1.0.0
 * @since 1.0.0
 * @example
 * areaRectangulo(4, 6); // 24
 */
export function areaRectangulo(ladoA, ladoB) {
    validarMedida(ladoA, "El lado A");
    validarMedida(ladoB, "El lado B");
    return ladoA * ladoB;
}
