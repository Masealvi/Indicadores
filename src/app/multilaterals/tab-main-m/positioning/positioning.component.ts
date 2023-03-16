import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IndicadorMultilateralService } from '../../services/indicador-multilateral.service';
import { Chart } from 'angular-highcharts';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Graficas } from 'src/app/utils/graficas';
import { Utilidades } from 'src/app/utils/utilidades';
import { SendCodeService } from '../../services/tab/send-code.service';
import { KEY_PARAM_ML } from 'src/app/national/tab-main-n/config/config';

@Component({
  selector: 'app-positioning',
  templateUrl: './positioning.component.html',
  styleUrls: ['./positioning.component.css']
})
export class PositioningComponent implements OnInit {
  formGraficar?: FormGroup;

  paises = new FormControl();
  anios = new FormControl();

  _aKeys: any = { score: "3", rank: "4" };

  years: any;
  countries: any;
  tableValue: any;

  private dataPosicionamiento: any;

  lineChart: Chart = new Chart();
  barChart: Chart = new Chart();
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

  private getIndicatorMultilateral(code: string) {
    this.indicadorMultilateralService.getIndicatorMultilateralByCode(code).subscribe(
      (response) => {
        this.dataPosicionamiento = response.data[1]; // data
        this.years = Utilidades.getYears(this.dataPosicionamiento.series, 0)
        this.countries = Utilidades.getCountries(this.dataPosicionamiento.series, 1);
      }
    );

  }

  private crarFormulario(): void {
    this.formGraficar = this.fb.group({
      cboOrden: [this._aKeys.score]
    });
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
      this.selectToChips.push({ code: code, valor: value, tipo: strTipo },);
    } else {
      this.selectToChips = this.selectToChips.filter(e => e.code !== code);
    }
  }

  //botón graficar
  graficar(): void {
    let itemSearch = this.formGraficar?.get("cboOrden")?.value;
    // process.
    let aFiltro = [...this.selectToChips];
    aFiltro.unshift({ code: 'PER', valor: 'Peru', tipo: "P" });
    aFiltro.push({ code: itemSearch, valor: itemSearch, tipo: "G" });

    //grafica de barra
    this.barChart = Graficas.generateBarChart(this.getDataLeaked(aFiltro));
    //grafica de linea
    this.lineChart = Graficas.generateLineChart(this.getDataLeaked(aFiltro));
    //grafica table
    this.tableHtml = Graficas.generateTable(this.tableValue, 'LPI');
  }

  getDataLeaked(data: any[]) {
    let arrayFiltrado: any[] = [];
    let newFiltrado: any[] = [];
    let arrayPais: any[] = [];
    let arrayAnio: any[] = [];
    let posMedida: number = 0;
    let aData: any[] = [];
    let serie = this.dataPosicionamiento.series;

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
      valor = parseFloat(arrayFiltrado[index].slice(posMedida, posMedida + 1));
      newFiltrado[index].push(valor);
    }
    return newFiltrado;
  }
}