import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { IndicadorMultilateralService } from '../../services/indicador-multilateral.service';
import { Utilidades } from 'src/app/utils/utilidades';
import { Chart } from 'angular-highcharts';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Constantes } from '../../../utils/constantes';
import { MULTILATERAL_INDICE } from 'src/app/utils/variables';
import { Graficas } from 'src/app/utils/graficas';
import { SendCodeService } from '../../services/tab/send-code.service';
import { KEY_PARAM_ML } from 'src/app/national/tab-main-n/config/config';

@Component({
  selector: 'app-comparative',
  templateUrl: './comparative.component.html',
  styleUrls: ['./comparative.component.css']
})
export class ComparativeComponent implements OnInit {

  formGraficar?: FormGroup;

  paises = new FormControl();
  anios = new FormControl();

  _aKeys: any = { score: "-Score", rank: "-Rank" };

  years: any;
  countryList: any[] = [{ code: 'MEX', name: 'MEXICO' }, { code: 'ARG', name: 'ARGENTINA' }];
  countries: any;
  tableValue: any;

  private dataComparativo: any;
  private medida: any[] = [];
  medidaFiltrado: any[] = [];

  lineChart: Chart = new Chart();
  columnChart: Chart = new Chart();
  tableHtml: any;

  codes: any;

  constructor(
    private indicadorMultilateralService: IndicadorMultilateralService,
    private route: ActivatedRoute,
    private sendCodeService: SendCodeService,
    private fb: FormBuilder
  ) {
    this.crarFormulario();
  }

  ngOnInit(): void {
    this.codes = this.route.snapshot.paramMap.get('codigo');
    localStorage.setItem(KEY_PARAM_ML, JSON.stringify({ graphic: this.codes }));
    this.sendCodeService.onChangeIndicador$.next(this.codes);
    this.getIndicatorMultilateral(this.codes);
  }

  private crarFormulario(): void {
    this.formGraficar = this.fb.group({
      cboMedida: [],
      cboOrden: [this._aKeys.score]
    });
  }

  private getIndicatorMultilateral(code: string) {
    this.indicadorMultilateralService.getIndicatorMultilateralByCode(code).subscribe(
      (response) => {
        this.dataComparativo = response.data[2]; // data
        this.years = Utilidades.getYears(this.dataComparativo.series, 0)
        this.countries = Utilidades.getCountries(this.dataComparativo.series, 1);
        console.log(this.countries);
        this.medida = this.dataComparativo.dimensiones; // Originales
        this.getMedidaFiltrado();
      }
    );

  }

  private getMedidaFiltrado(): void {
    let aFitro: string[] = [this._aKeys.score, this._aKeys.rank];
    let _newDimensiones = [...new Set(this.medida.map((e: any) => Utilidades.replaceWordsByKeys(e, aFitro)))];
    this.medidaFiltrado = _newDimensiones.map(e => e).slice(3);
    if (this.medidaFiltrado != null && this.medidaFiltrado.length > 0) {
      this.formGraficar?.get("cboMedida")?.setValue(this.medidaFiltrado[0]);
    }
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
    // null undefined
    let resultado = this.selectToChips.find(e => e.code === code) ?? null; // e | null
    if (resultado == null) {
      this.selectToChips.push({ code: code, valor: value, tipo: strTipo },);
    } else {
      this.selectToChips = this.selectToChips.filter(e => e.code !== code);
    }
  }

  getDataLeaked(data: any[]) {
    let arrayFiltrado: any[] = [];
    let newFiltrado: any[] = [];
    let arrayPais: any[] = [];
    let arrayAnio: any[] = [];
    let posMedida: number = 0;
    let aData: any[] = [];
    let serie = this.dataComparativo.series;

    for (let index = 0; index < data.length; index++) {
      if (data[index].tipo === 'P') {
        arrayPais.push(data[index].code);
      }
      if (data[index].tipo === 'A') {
        arrayAnio.push(data[index].code);
      }
      if (data[index].tipo === 'G') {
        posMedida = parseFloat(data[index].code);
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
          newFiltrado.push(s.slice(0, 3));
        }
      });
    });

    this.tableValue = arrayFiltrado;
    for (let index = 0; index < arrayFiltrado.length; index++) {
      let valor: number;
      let valor2: number;
      valor = parseFloat(arrayFiltrado[index].slice(posMedida, posMedida + 1));
      valor2 = parseFloat(arrayFiltrado[index].slice(posMedida + 1, posMedida + 2));
      newFiltrado[index].push(valor);
      newFiltrado[index].push(valor2);
    }
    return newFiltrado;
  }

  //botón graficar
  graficar(): void {
    let itemSearch = this.formGraficar?.get("cboMedida")?.value + this.formGraficar?.get("cboOrden")?.value;
    let posMedida = this.medida.findIndex((e: any) => e === itemSearch);
    if (posMedida == -1) {
      // no selecciono medida | medida seleccionada no existe...
      return;
    }

    // process.
    let aFiltro = [...this.selectToChips];
    aFiltro.unshift({ code: 'PER', valor: 'Peru', tipo: "P" });
    aFiltro.push({ code: posMedida, valor: posMedida, tipo: "G" });

    //grafica de columna
    this.columnChart = Graficas.generateColumnChart(this.getDataLeaked(aFiltro));
    //grafica de linea
    this.lineChart = Graficas.generateLineChart(this.getDataLeaked(aFiltro));
    //grafica table¿
    this.tableHtml = Graficas.generateTable(this.getDataLeaked(aFiltro), this.formGraficar?.get("cboMedida")?.value);
  }

}