// Normalitza un paràmetre de ruta que pot ser una cadena, un array de cadenes o indefinit, retornant sempre una cadena.
export function getRouteParam(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}
