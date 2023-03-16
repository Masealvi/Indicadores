export interface IndicadorGraficos {
    codigoIndicador: string;
    nombreIndicador: string;
    dimensiones:     string[];
    unidadMedida:    string[] | null;
    series:          Array<Array<number | string> | number | string>;
}
