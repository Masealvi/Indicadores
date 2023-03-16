import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { IndicadorMultilateralService } from '../../services/indicador-multilateral.service';
import { Utilidades } from 'src/app/utils/utilidades';
import { Chart } from 'angular-highcharts';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Graficas } from 'src/app/utils/graficas';
import { SendCodeService } from '../../services/tab/send-code.service';
import { KEY_PARAM_ML } from 'src/app/national/tab-main-n/config/config';

@Component({
  selector: 'app-railways',
  templateUrl: './railways.component.html',
  styleUrls: ['./railways.component.css']
})
export class RailwaysComponent implements OnInit {
  formGraficar?: FormGroup;

  paises = new FormControl();
  anios = new FormControl();

  years: any;
  countries: any;

  private dataRailways: any;
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
    });
  }

  private getIndicatorMultilateral(code: string) {
    this.indicadorMultilateralService.getIndicatorMultilateralByCode(code).subscribe(
      (response) => {
        this.dataRailways = response.data[3];
        this.years = Utilidades.getYears(this.dataRailways.series, 0)
        this.countries = Utilidades.getCountries(this.dataRailways.series, 1);
        this.medida = this.dataRailways.dimensiones; // Originales
        this.getMedidaFiltrado();
      }
    );

  }

  private getMedidaFiltrado(): void {
    let _newDimensiones: any[] = this.medida;
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
    let resultado = this.selectToChips.find(e => e.code === code) ?? null;
    if (resultado == null) {
      this.selectToChips.push({ code: code, valor: value, tipo: strTipo });
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
    let serie = this.dataRailways.series;

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

    for (let index = 0; index < arrayFiltrado.length; index++) {
      let valor: number;
      valor = parseFloat(arrayFiltrado[index].slice(posMedida, posMedida + 1));
      newFiltrado[index].push(valor);
    }
    return newFiltrado;
  }

  //botón graficar
  graficar(): void {
    let itemSearch = this.formGraficar?.get("cboMedida")?.value;
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
    //grafica table
    this.tableHtml = Graficas.generateTable3(this.getDataLeaked(aFiltro));
  }

}
