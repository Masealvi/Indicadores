import { Chart } from 'angular-highcharts';

export class Graficas {
    static columnChart: Chart;
    static lineChart: Chart;
    static barChart: Chart;
    static donutChart: Chart;
    static _htmlTable: string;

    public static generateColumnChart(dataFiltrada: any) {
        this.columnChart = new Chart({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.generateCategory(dataFiltrada, 0),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: this.generateSerie(dataFiltrada, 'column')
        })
        return this.columnChart;
    }

    public static generateLineChart(dataFiltrada: any) {
        let range = this.generateRange(dataFiltrada);
        this.lineChart = new Chart({
            title: {
                text: '',
                align: 'left'
            },
            credits: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            xAxis: {
                accessibility: {
                    rangeDescription: `Range: ${parseFloat(range[0])} to ${parseFloat(range[range.length - 1])}`
                }
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: parseFloat(range[0])
                }
            },
            series: this.generateSerie(dataFiltrada, 'line'),
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
        return this.lineChart;
    }

    public static generateBarChart(dataFiltrada: any) {
        this.barChart = new Chart({
            chart: {
                type: 'bar'
            },
            title: {
                text: '',
                align: 'left'
            },
            xAxis: {
                categories: this.generateCategory(dataFiltrada, 1),
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: this.generateSerie(dataFiltrada, 'bar')
        })
        return this.barChart;
    }

    public static generateBarChart2(category: any, data: any) {
        this.barChart = new Chart({
            chart: {
                type: 'bar'
            },
            title: {
                text: '',
                align: 'left'
            },
            xAxis: {
                categories: category,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: this.generateSerie2(data, 'bar')
        })
        return this.barChart;
    }

    private static generateCategory(dataFiltrada: any[], position: number) {
        var array_category: any[] = [...new Set(dataFiltrada.map(e => e[position]))];
        return array_category;
    }

    private static generateSerie(dataFiltrada: any[], type: string) {
        var number: number;
        var array_name: any[];
        if (type === 'bar') {
            number = 0; //posición de año
            array_name = [...new Set(dataFiltrada.map(e => e[number]))];
            let mayor: number = 0;
            for (let index = 0; index < array_name.length; index++) {
                if (array_name[index] > mayor) {
                    mayor = array_name[index];
                }
            }
            array_name = [mayor];
        } else {
            number = 1; //posición de país
            array_name = [...new Set(dataFiltrada.map(e => e[number]))];
        }

        var array_serie: any[] = [];
        array_name.forEach((e) => {
            let aData: any = [];
            dataFiltrada.filter((s) => {
                if (s[number] == e) {
                    aData.push(s[3]);
                }
            });
            array_serie.push({ type: type, name: `${e}`, data: aData });
        });
        return array_serie;
    }

    //Pestaña Comparación de Medidas del indicador 2
    public static generateSerie2(dataFiltrada: any[], type: string) {
        var number: number = 1; //Posición de País
        var array_name: any[];
        array_name = [...new Set(dataFiltrada.map(e => e[number]))];
        console.log(dataFiltrada);
        var array_serie: any[] = [];
        array_name.forEach((e) => {
            let aData: any = [];
            dataFiltrada.filter((s) => {
                if (s[number] == e) {
                    aData = s.slice(3);
                }
            });
            array_serie.push({ type: type, name: `${e}`, data: aData });
        });
        return array_serie;
    }

    private static generateRange(dataFiltrada: any[]) {
        var array_range: any[] = [...new Set(dataFiltrada.map(e => e[0]))];
        return array_range;
    }

    public static generateTable(dataTable: any[], name: string) {
        const _colAnio = 0, _colNombre = 1, _colCodigo = 2, _colScore = 3, _colRank = 4;

        const _tableBordered = "table table-bordered table-condensed",
            _textCenter = "text-center", _textLeft = "text-left", _textRight = "text-right";
        const _aAnio = [...new Set(dataTable.map(e => e[_colAnio]))];
        const _aCodPais = [...new Set(dataTable.map(e => e[_colCodigo]))];
        const _aNomPais = [...new Set(dataTable.map(e => e[_colNombre]))];
        let _totColumns = _aAnio.length * 2 + 2;
        let _htmlAnio = "", _htmlTitle = "", _htmlThead = "", _htmlTbody = "";
        // generate head anios...
        _aAnio.forEach(e => {
            _htmlAnio += `<th colspan="2" class="bg-secondary-indicador">${e}</th>`;
            _htmlTitle += `<th>Score</th><th>Rank</th>`;
        });
        // generate thead [row: titulo, row: anios, row: titulos]
        _htmlThead =
            `<thead class="${_textCenter}">
                <tr>
                    <th colspan="${_totColumns}" class="bg-primary-indicador">${name}</th>
                </tr>
                <tr>
                    <th colspan="2"></th>
                    ${_htmlAnio}
                </tr>
                <tr>
                    <th>País</th>
                    <th>Código</th>
                    ${_htmlTitle}
                </tr>        
            </thead>`;
        // generate body
        _aCodPais.forEach((c, row) => {
            // Generate row [Pais | Codigo]
            _htmlTbody += `<tr><td class="${_textLeft}">${_aNomPais[row]}</td><td class="${_textLeft}">${c}</td>`;
            dataTable.forEach(d => {
                //Generate columns by anio [ score - rank ]
                if (d[_colCodigo] === c) {
                    _htmlTbody += `<td class="${_textRight}">${d[_colScore]}</td><td class="${_textRight}">${d[_colRank]}</td>`;
                }
            });
            // close row
            _htmlTbody + "<tr>";

        });

        _htmlTbody = `<tbody>${_htmlTbody}</thead>`;

        this._htmlTable = `<table class="${_tableBordered}">${_htmlThead}${_htmlTbody}</table>`;
        return this._htmlTable;
    }

    public static generateTable2(category: any[], dataTable: any[]) {
        console.log(dataTable);
        const _colAnio = 0, _colNombre = 1, _colCodigo = 2, _colValue = 3;

        const _tableBordered = "table table-bordered table-condensed",
            _textCenter = "text-center", _textLeft = "text-left", _textRight = "text-right";
        const _aAnio = [...new Set(dataTable.map(e => e[_colAnio]))];
        const _aCodPais = [...new Set(dataTable.map(e => e[_colCodigo]))];
        const _aNomPais = [...new Set(dataTable.map(e => e[_colNombre]))];
        let _totColumns = category.length + 2;
        let _htmlAnio = "", _htmlTitle = "", _htmlThead = "", _htmlTbody = "";
        // generate head anios...
        _aAnio.forEach(e => {
            _htmlAnio += `<th colspan="${_totColumns}">${e}</th>`;
        });
        category.forEach(e => {
            _htmlTitle += `<th>${e}</th>`;
        });
        _htmlThead =
            `<thead class="${_textCenter}">
                <tr class="bg-primary-indicador">
                    ${_htmlAnio}
                </tr>
                <tr class="bg-secondary-indicador">
                    <th>País</th>
                    <th>Código</th>
                    ${_htmlTitle}
                </tr>        
            </thead>`;
        // generate body
        _aCodPais.forEach((c, row) => {
            // Generate row [Pais | Codigo]
            _htmlTbody += `<tr><td class="${_textLeft}">${_aNomPais[row]}</td><td class="${_textLeft}">${c}</td>`;
            dataTable.forEach(d => {
                if (d[_colCodigo] === c) {
                    let valores: any[] = d.slice(_colValue);
                    for (let index = 0; index < valores.length; index++) {
                        _htmlTbody += `<td class="${_textRight}">${valores[index]}</td>`;
                    }
                }
            });
            // close row
            _htmlTbody + "<tr>";

        });

        _htmlTbody = `<tbody>${_htmlTbody}</thead>`;

        this._htmlTable = `<table class="${_tableBordered}">${_htmlThead}${_htmlTbody}</table>`;
        return this._htmlTable;
    }

    public static genarateSpiderChart(category: any, data: any, posName: number): any {
        let spider = new Chart({
            chart: {
                polar: true,
                type: 'line'
            },
            credits: {
                enabled: false
            },
            title: {
                text: '',
                x: -80
            },
            pane: {
                size: '90%'
            },
            xAxis: {
                categories: category,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },
            series: this.generateSerieSpider(data, 'polygon', posName),
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        },
                        pane: {
                            size: '70%'
                        }
                    }
                }]
            }
        });
        return spider;
    }

    public static generateSerieSpider(dataFiltrada: any[], type: string, posName: number) {
        let posInicial: number;
        if (posName == 0) {//NombreSerie: año
            posInicial = 5;
        } else if (posName == 1) {//NombreSerie: pais
            posInicial = 3;
        }
        var array_name: any[];
        array_name = [...new Set(dataFiltrada.map(e => e[posName]))];
        var array_serie: any[] = [];
        array_name.forEach((e) => {
            let aData: any = [];
            dataFiltrada.filter((s) => {
                if (s[posName] == e) {
                    aData = s.slice(posInicial);
                }
            });
            array_serie.push({ type: type, name: `${e}`, data: aData, pointPlacement: 'on' });
        });
        return array_serie;
    }

    public static genarateDonutChart(category: any, data: any) {
        let array_donut: any = [];
        for (let index = 0; index < category.length; index++) {
            this.donutChart = new Chart({
                chart: {
                    type: 'pie',
                    plotShadow: false,
                },
                credits: {
                    enabled: false,
                },
                plotOptions: {
                    pie: {
                        innerSize: '85%',
                        borderWidth: 40,
                        borderColor: '',
                        slicedOffset: 20,
                        dataLabels: {
                            enabled: false,
                        },
                        showInLegend: true
                    },
                },
                title: {
                    floating: false,
                    text: category[index],
                },
                series: [
                    {
                        type: 'pie',
                        data: this.generateSerieDonutChart(index + 3, data)
                    }
                ]

            });
            var new_array: any[] = [];
            new_array.push(this.donutChart);
            new_array.push(this.generateTableDonutChart(index + 3, data));
            array_donut.push(new_array);
        }
        return array_donut;
    }

    public static generateSerieDonutChart(position: number, data: any) {
        var aData: any = [];
        for (let index = 0; index < data.length; index++) {
            aData = [{ name: data[index][0], y: data[index][position] }];
        }
        return aData;
    }

    public static generateTableDonutChart(position: number, data: any) {
        let table = '';
        table += '<table class="table table-bordered table-condensed">' +
            '<thead>' +
            '<tr class="bg-secondary-indicador">' +
            '<th></th>';
        for (let index = 0; index < data.length; index++) {
            table += '<th>' + data[index][0] + '</th>';
        }
        table += '</tr>'
        '</thead>' +
            '<tbody>' +
            '<tr>';
        for (let index = 0; index < data.length; index++) {
            table += '<td>' + data[index][1] + '</td>' +
                '<td>' + data[index][position] + '</td>';
        }
        table += '</tr>' +
            '</tbody>' +
            '</table>'
        return table;
    }

    public static generateTable3(dataTable: any[]) {
        const _colAnio = 0, _colNombre = 1, _colCodigo = 2, _colValue = 3;
        const _aAnio = [...new Set(dataTable.map(e => e[_colAnio]))];
        const _aCodPais = [...new Set(dataTable.map(e => e[_colCodigo]))];
        const _aNomPais = [...new Set(dataTable.map(e => e[_colNombre]))];
        let _htmlAnio = "", _htmlTitle = "", _htmlThead = "", _htmlTbody = "";
        // generate head anios...
        _aAnio.forEach(e => {
            _htmlAnio += `<th class="bg-secondary-indicador">${e}</th>`;
        });
        // generate thead [row: titulo, row: anios, row: titulos]
        _htmlThead =
            `<thead>
                <tr>
                    <th colspan="2"></th>
                    ${_htmlAnio}
                </tr>     
            </thead>`;
        // generate body
        _aCodPais.forEach((c, row) => {
            // Generate row [Pais | Codigo]
            _htmlTbody += `<tr><td class="text-left">${_aNomPais[row]}</td><td class="text-left">${c}</td>`;
            dataTable.forEach(d => {
                //Generate columns by anio
                if (d[_colCodigo] === c) {
                    _htmlTbody += `<td class="text-rigth">${d[_colValue]}</td>`;
                }
            });
            // close row
            _htmlTbody + "<tr>";

        });
        _htmlTbody = `<tbody>${_htmlTbody}</thead>`;

        this._htmlTable = `<table class="table table-bordered">${_htmlThead}${_htmlTbody}</table>`;
        return this._htmlTable;
    }
}