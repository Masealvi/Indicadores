import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { GrafhicsService } from '../../services/graphics.service';
import { IndicadorChildToParentService } from '../../services/graficas/indicador-child-to-parent.service';
import { Graficas } from 'src/app/utils/graficas';
import * as Highcharts from 'highcharts';

declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

@Component({
  selector: 'app-grafhics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GrafhicsComponent implements OnInit {

  date: any;
  unidadMedida?: string[];
  codes: any;
  lineChart: Chart = new Chart();
  areaChart: Chart = new Chart();
  columnChart: Chart = new Chart();
  barChart: Chart = new Chart();
  donutChart: Chart = new Chart();
  array_donut: any = [];
  array_donut2: any = [];
  company: any = [];
  years: any = [];
  selectedYear: any;
  selectedCompany: any;
  dataSeries: any = [];
  nombreIndicator?: string;

  
  constructor(
    private graphicsService: GrafhicsService,
    private route: ActivatedRoute,
    private childToParentService: IndicadorChildToParentService
  ) { }

  ngOnInit(): void {
    this.codes = this.route.snapshot.paramMap.get('code');
    localStorage.setItem("param", JSON.stringify({ graphic: this.codes }));
    console.log("set new indicador");
    this.childToParentService.onChangeIndicador$.next(this.codes);
    //if (code == '3.13.1' || code == '5.2' || code == '5.3') {
    this.getIndicatorByCode(this.codes);
    // ejecutarEvento();
    //}    
  }
  private getIndicatorByCode(code: string) {
    this.graphicsService.getIndicatorByCode(code).subscribe(
      (response) => {
        console.log(response);
        
        if (response.series.length < 1) {
          alert("No hay datos en el indicador indicado");
        }
        this.unidadMedida = this.generateHead(response.dimensiones);
       // console.log(this.unidadMedida);
        this.generateDonutChart(response.series);
        this.dataSeries = response.series;
        this.company = this.getData(response.series, 1);
        this.years = this.getData(response.series, 0);


        this.nombreIndicator = response.nombreIndicador;
        this.generateBarChart(response.series);
        this.generateColumnChart(response.series);
        this.generateLineChart(response.series);
        this.generateAreaChart(response.series);
      },
      (error) => {
        // exception
        alert("Indicador no existe");
      },
    );
  }
  filterByYearAndCompany() {

    
    var array_datos: any = [];
    console.log(this.selectedYear, this.selectedCompany);
    if ((this.selectedYear=== null && this.selectedCompany === null) || (this.selectedYear === undefined && this.selectedCompany === undefined)
      || (this.selectedYear === '' && this.selectedCompany === '')) {

      array_datos = this.dataSeries;

      console.log(array_datos);

      console.log("entro al if");
    } else {
      console.log("entro al else");
      array_datos = this.dataSeries.filter((serie: any) => {

        return ((this.selectedYear=== undefined || this.selectedYear=== '') ? true : serie[0].toString() === this.selectedYear) &&
          ((this.selectedCompany === undefined || this.selectedCompany === '') ? true : serie[1].toString() === this.selectedCompany);
      });

      console.log(array_datos);

    }

    this.generateDonutChart(array_datos);
    this.generateBarChart(array_datos);
    this.generateColumnChart(array_datos);
    this.generateAreaChart(array_datos);
    this.generateLineChart(array_datos);

  }

  private generateDonutChart(series: any) {

    console.log(this.selectedYear, this.selectedCompany);

    var serie = this.generateSerieDonutChart(series);
    var array_categoryNoRepetido = this.generateCategory(series);

    console.log(array_categoryNoRepetido);
    console.log(serie);
    this.array_donut = [];
    for (let index = 0; index < array_categoryNoRepetido.length; index++) {
      //console.log(index);
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
          //verticalAlign: 'middle',
          floating: false,
          text: array_categoryNoRepetido[index],
        },
        series: [
          {
            type: 'pie',
            data: serie[index],
          },
        ],
      });



      var new_array: any[] = [];

      new_array.push(this.donutChart);
      new_array.push(serie[index]);
      this.array_donut.push(new_array);

      //console.log(this.array_donut);
    }

  }

  

  private generateBarChart(series: any) {
    this.barChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: this.nombreIndicator,
        align: 'center'
      },
      xAxis: {
        categories: this.generateCategory(series),
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
        },
        tickInterval: 1
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
      series: this.generateSerie(series, 'bar')
    })
    return this.barChart;
  }

  private generateColumnChart(series: any) {
    this.columnChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: this.nombreIndicator,
        align: 'center'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: this.generateCategory(series),
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
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
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
      series: this.generateSerie(series, 'column')
    });
  }

  private generateLineChart(series: any) {
    this.lineChart = new Chart({
      title: {
        text: this.nombreIndicator,
        align: 'center'
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        accessibility: {
          rangeDescription: `Range: ${parseFloat(this.generateRange(series)[0])} to ${parseFloat(this.generateRange(series)[this.generateRange(series).length - 1])}`
        },
        tickInterval: 1
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: parseFloat(this.generateRange(series)[0])
        }
      },
      series: this.generateSerieLine(series, 'line'),

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
  }

  private generateAreaChart(series: any) {
    this.areaChart = new Chart({
      chart: {
        type: 'area'
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.nombreIndicator,
        align: 'center'
      },
      xAxis: {
        allowDecimals: false,
        accessibility: {
          rangeDescription: `Range: ${parseFloat(this.generateRange(series)[0])} to ${parseFloat(this.generateRange(series)[this.generateRange(series).length - 1])}`
        }
      },
      yAxis: {
        title: {
          text: ''
        },
      },
      tooltip: {
        pointFormat: '{series.name} <b>{point.y:,.0f}</b><br/>en {point.x}'
      },
      plotOptions: {
        area: {
          pointStart: parseFloat(this.generateRange(series)[0]),
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: this.generateSerieLine(series, 'area'),
    });
  }

  private generateCategory(data: any[]) {
    var array_category: any[] = [...new Set(data.map(e => e[1]))]; // unico
    return array_category;
  }

  private generateSerieDonutChart(data: any[]) {
    //["anio", "nombre", "valor"]]
    var array_name: any[] = [...new Set(data.map(e => e[1]))];
    console.log(array_name);
    var aData: any = [];
    array_name.forEach((e) => {
      aData.push([]);
      console.log(aData);

      data.filter((s) => {
        if (s[1] == e) {
          aData[aData.length - 1].push({ name: s[0], y: s[2] });
        }
      });
    });


    return aData;


  }

  private generateSerie(series: any[], type: string) {
    var arreglo: any[] = [];
    var arregloAnios: any[] = [];
    var categories: any[] = [];

    for (let index = 0; index < series.length; index++) {
      if (arregloAnios.indexOf(series[index][0]) == -1) {
        arregloAnios.push(series[index][0]);
      }
      if (categories.indexOf(series[index][1]) == -1) {
        categories.push(series[index][1]);
      }
    }

    for (let ind = 0; ind < arregloAnios.length; ind++) {
      var arregloData: any[] = [];
      for (let index = 0; index < categories.length; index++) {
        arregloData.push(0.0);
      }
      for (let f = 0; f < series.length; f++) {
        if (series[f][0] == arregloAnios[ind]) {
          arregloData[categories.indexOf(series[f][1])] = parseFloat(series[f][2]);
        }
      }

      arreglo.push({ type: type, name: `${arregloAnios[ind]}`, data: arregloData, });
    }

    //console.log("ver serie ***")
    console.log(arreglo);
    return arreglo;
  }
  private generateSerieLine(data: any[], type: string) {
    var array_anios: any[] = [...new Set(data.map((e) => e[0]))]; // unico[2022,2021]
    var categories: any[] = [...new Set(data.map((u) => u[1]))]; //lista de categorias
    var array_serie: any[] = [];
    categories.forEach((e) => {
      var aData: any[] = [];
      array_anios.forEach((r) => {
        aData.push(0.0);
      });
      data.filter((s) => {
        if (s[1] == e) {
          aData[array_anios.indexOf(s[0])] = s[2];
        }
      });
      array_serie.push({ type: type, name: `${e}`, data: aData });
    });
    return array_serie;
  }
  private generateRange(data: any[]) {
    var array_range: any[] = [...new Set(data.map(e => e[0]))]; // unico
    return array_range;
  }

  private generateHead(data: any) {
    var newData: any = [];
    newData.push(data[0]);
    newData.push(data[2]);
    return newData;
  }

  private getData(data: any[], position: number) {
    var array: any[] = [...new Set(data.map(e => e[position].toString()))];
    return array;
  }

}
