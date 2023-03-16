export interface FichaIndicador {
    "codigo-indicador": string;
    titulo:             string;
    fuente:             string;
    ficha:              Ficha;
    datos:              Datos;
}

export interface Datos {
    "definicion-del-indicador":                     string;
    "formula-de-calculo":                           string;
    "descripcion-de-la-formula":                    string;
    "unidad-de-medicion-del-indicador-dimensiones": string;
    "tipo-de-indicador":                            string;
    "nivel-de-desagregacion":                       string;
    "periodo-de-disponibilidad":                    string;
}

export interface Ficha {
    id:   number;
    url:  string;
    size: number;
    type: string;
}
