export interface IndicadorTablas {
    codigoIndicador: string;
    nombreIndicador: string;
   dimensiones:     string[];
    unidadMedida:    string[];
    series:         Array<Array<number | string>>;
    data:            Datos[];
}

export interface Datos {
    tabla:       null | string;
    dimensiones: string[];
    series:      Array<Array<number | SeriesEnum>>;
}
export enum SeriesEnum {
    ATravesDelPeru = "A TRAVES DEL PERU",
    AgenciaAduaneraDeDesaguadero = "AGENCIA ADUANERA DE DESAGUADERO",
    AgenciaAduaneraDeLaTina = "AGENCIA ADUANERA DE LA TINA",
    AgenciaAduaneraDeSantaRosa = "AGENCIA ADUANERA DE SANTA ROSA",
    Autotransporte = "AUTOTRANSPORTE",
    CargaSuelta = "CARGA SUELTA",
    CargamentoExcepcional = "CARGAMENTO EXCEPCIONAL",
    Contenedor = "CONTENEDOR",
    ContenedorVacio = "CONTENEDOR VACIO",
    DestinoPeru = "DESTINO PERU",
    InicioPeru = "INICIO PERU",
    IntendenciaDeAduanaDePuertoMaldonado = "INTENDENCIA DE ADUANA DE PUERTO MALDONADO",
    IntendenciaDeAduanaDeTumbes = "INTENDENCIA DE ADUANA DE TUMBES",
    PesoBrutoKg = "Peso bruto (Kg).",
    Remonta = "REMONTA",
    ValorFOBUS = "Valor FOB (US$)",
}

