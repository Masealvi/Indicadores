import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utilidades } from 'src/app/utils/utilidades';
import { IndicadorMultilateralService } from '../../services/indicador-multilateral.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'angular-highcharts';
import { Graficas } from 'src/app/utils/graficas';
import { SendCodeService } from '../../services/tab/send-code.service';
import { KEY_PARAM_ML } from 'src/app/national/tab-main-n/config/config';

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
  selector: 'app-comparison-by-measures',
  templateUrl: './comparison-by-measures.component.html',
  styleUrls: ['./comparison-by-measures.component.css']
})
export class ComparisonByMeasuresComponent implements OnInit {
  codes: any;
  years: any;
  countries: any;

  radialChart: Chart = new Chart();
  barChart: Chart = new Chart();
  tableHtml: any;

  dataComparaMedidas: any;

  paises = new FormControl();
  anios = new FormControl();

  constructor(
    private indicadorMultilateralService: IndicadorMultilateralService,
    private route: ActivatedRoute,
    private sendCodeService: SendCodeService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.codes = this.route.snapshot.paramMap.get('codigo');
    localStorage.setItem(KEY_PARAM_ML, JSON.stringify({ graphic: this.codes }));
    this.sendCodeService.onChangeIndicador$.next(this.codes);
    this.getIndicatorMultilateral(this.codes);
  }

  private getIndicatorMultilateral(code: string) {
    this.indicadorMultilateralService.getIndicatorMultilateralByCode(code).subscribe(
      (response) => {
        this.dataComparaMedidas = response.data[2];
        this.years = Utilidades.getYears(this.dataComparaMedidas.series, 0)
        this.countries = Utilidades.getCountries(this.dataComparaMedidas.series, 1);
      }
    );
  }

  //#CHIPS
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  selectToChips: any[] = [];

  removeChip(seleccionado: any): void {
    let index = this.selectToChips.indexOf(seleccionado);
    if (index >= 0) {
      this.selectToChips.splice(index, 1);
      if (this.paises.value?.length > 0) {
        index = this.paises.value.findIndex((e: any) => e === seleccionado.valor);
        if (index >= 0) {
          this.paises.value.splice(index, 1);
          this.paises.patchValue(this.paises.value);
        }
      }
      if (this.anios.value?.length > 0) {
        index = this.anios.value.findIndex((e: any) => e === seleccionado.valor);
        if (index >= 0) {
          this.anios.value.splice(index, 1);
          this.anios.patchValue(this.anios.value);
        }
      }
    }
  }
  //END CHIPS

  getFiltrosAplicados(code: any, value: any, strTipo: string) {
    let resultado = this.selectToChips.find(e => e.code === code) ?? null;
    if (resultado == null) {
      this.selectToChips.push({ code: code, valor: value, tipo: strTipo });
    } else {
      this.selectToChips = this.selectToChips.filter(e => e.code !== code);
    }
    let count = 0;
    for (let index = 0; index < this.selectToChips.length; index++) {
      if (this.selectToChips[index].tipo == 'P') {
        count++;
      }
      if (count > 4) {
        alert("Selección máximo de 4 países");
      }
    }
  }

  graficar(): void {
    // process.
    let category = this.dataComparaMedidas.dimensiones.slice(3);
    let aFiltro = [...this.selectToChips];
    aFiltro.unshift({ code: 'PER', valor: 'Peru', tipo: "P" });
    //grafica de barra
    this.barChart = Graficas.generateBarChart2(category, this.getDataLeaked(aFiltro));
    //grafica de linea
    this.radialChart = Graficas.genarateSpiderChart(category, this.getDataLeaked(aFiltro), 1);
    //grafica table
    this.tableHtml = Graficas.generateTable2(category, this.getDataLeaked(aFiltro));
  }

  getDataLeaked(data: any[]) {
    let arrayFiltrado: any[] = [];
    let arrayPais: any[] = [];
    let arrayAnio: any[] = [];
    let aData: any[] = [];
    let serie = this.dataComparaMedidas.series;

    for (let index = 0; index < data.length; index++) {
      if (data[index].tipo === 'P') {
        arrayPais.push(data[index].code);
      }
      if (data[index].tipo === 'A') {
        arrayAnio.push(data[index].code);
      }
    }

    arrayPais.forEach((e) => {
      serie.filter((s: any) => {
        if (s[2] == e) {
          aData.push(s);
        }
      });
    });

    arrayAnio.forEach((e) => {
      aData.forEach((s) => {
        if (s[0] == e) {
          arrayFiltrado.push(s);
        }
      });
    });
    return arrayFiltrado;
  }

}
