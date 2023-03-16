export class Utilidades {

    public static replaceWordsByKeys(cadena: string, searchKey: string[], replaceValue: string = ""): string {
        searchKey.forEach(e => { cadena = cadena.replace(e, replaceValue); });
        return cadena;
    }

    public static jsonObjectToArrayFromKey(jsonObject: any): any[] {
        return Object.entries(jsonObject).map(([key]) => key);
    }

    public static jsonObjectToArrayFromValue(jsonObject: any): any[] {
        return Object.entries(jsonObject).map(([value]) => value);
    }

    public static getYears(data: any[], position: number) {
        var array: any[] = [...new Set(data.map(e => e[position]))];
        return array;
      }

    public static getCountries(data: any[], position: number) {
        let posCode: number = 2;
        var array_name: any[] = [...new Set(data.map(e => e[position]))];
        var array_data: any[] = [];
        array_name.forEach((e) => {
            data.filter((s) => {
                if (s[position] == e) {
                    if (!array_data.find(nombre => nombre.name === e)) {
                        array_data.push({ code: s[posCode], name: `${e}` });
                    }
                }
            });
        });
        return array_data;
    }

    
}