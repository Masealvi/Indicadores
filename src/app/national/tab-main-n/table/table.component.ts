import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrafhicsService } from '../../services/graphics.service';
import { IndicadorChildToParentService } from '../../services/graficas/indicador-child-to-parent.service';
import { PageEvent } from '@angular/material/paginator';
import { IndicadorTablas } from '../../interfaces/indicadorTable';
import { Datos } from '../../interfaces/fichaIndicador';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [GrafhicsService]
})
export class TableComponent implements OnInit {


  codes: string = '';
  public tableHead: IndicadorTablas[] = [];
  public tableBody: IndicadorTablas[][] = [];
  public tablePerson: Datos[] = [];
  public tableMedicion: IndicadorTablas[] = [];
  public tableReduccion: IndicadorTablas[] = [];
  public tableSerie2: IndicadorTablas[][] = [];
  public tableSerie3: IndicadorTablas[][] = [];
  public dataDate: any;
  public dataDate2: any;
  public dataTableSeries: IndicadorTablas[][] = [];
  dataGeiAll: any;
  dataFechaFirma: any;
  dataNameClass: any;
  dataEnterprise: any;
  dataEnterprise2: any;
  dataEmpresa: any;
  dataAcuerdo: any;




  public page: number = 0;

  pageSize = 12;
  desde: number = 0;
  hasta: number = 12;
  constructor(
    private graphicsService: GrafhicsService,
    private route: ActivatedRoute,
    private childToParentService: IndicadorChildToParentService
  ) { }

  ngOnInit(): void {

    let code: any = this.route.snapshot.paramMap.get('code');
    this.codes = code;
    localStorage.setItem("param", JSON.stringify({ graphic: code }));
    console.log("set new indicador");
    this.childToParentService.onChangeIndicador$.next(code);
    this.getIndicatorTableByCode(code);
  }
  private getIndicatorTableByCode(code: string) {
    this.graphicsService.getIndicatorByCodeTable(code).subscribe(
      (response) => {

        if (code == '2.1' || code == '3.13.1' || code == '3.13.2' || code == '3.13.4') {

          this.tableHead = response.dimensiones;
          this.tableBody = response.series;
          this.dataTableSeries = response.series;
          this.dataDate = this.getData(response.series, 1);
          this.dataEnterprise = this.getData(response.series, 0);
          this.dataFechaFirma = this.getData(response.series, 1);
          this.dataAcuerdo = this.getData(response.series, 3);
          this.dataDate2 = this.getData(response.series, 0);
          this.dataEnterprise2 = this.getData(response.series, 1);
        }
        if (code === '5.2' || code == '5.3') {

          this.tablePerson = response.data[0].dimensiones;
          // this.tableSerie1 = response.data[0].series;
          this.tableMedicion = response.data[1].dimensiones;
          this.tableSerie2 = response.data[1].series;
          this.tableReduccion = response.data[2].dimensiones;
          this.tableSerie3 = response.data[2].series;
          this.tableBody = response.data[0].series;
          this.dataTableSeries = response.data[0].series;
          this.dataDate = this.getData(response.data[0].series, 0);
          console.log(this.dataDate)
          this.dataEnterprise = this.getData(response.data[0].series, 1);
          this.dataNameClass = this.getData(response.data[0].series, 7);
          //this.dataGEI = this.getDataGei(response.data[0].series, 8);
          //console.log(this.dataGEI);
          this.dataGeiAll = this.getDataGeiAll(response.data[0].series, 8);



        }
        if (code == '1.1.1' || code == '1.1.2' || code == '1.1.3') {

          this.tableHead = response.dimensiones;
          this.tableBody = response.series;
          this.dataDate2 = this.getData1(response.series, 0);
          this.dataEnterprise2 = this.getData1(response.series, 1);
          this.dataTableSeries = response.series;
          console.log(this.tableBody);

        }


      },
      (error) => {
        alert("Indicador no existe");
      }
    );
  }

  private getData(data: any[], position: number) {
    var array: any[] = [...new Set(data.map(e => e[position]))];
    return array;
  }
  private getData1(data: any[], position: number) {
    var array: any[] = [...new Set(data.map(e => e[position].toString()))];
    return array;
  }

  private getDataGei(data: any[], position: number) {
    var array: any[] = [...new Set(data.map(e => e[position].toString()))];
    console.log(array);
    let dataGEIFilter: any[] = [];
    array.forEach(e => {
      if (e === 3 || e === 4) {
        dataGEIFilter.push(e.toString());
      }
    });
    console.log(dataGEIFilter);
    return dataGEIFilter;
  }

  private getDataGeiAll(data: any[], position: number) {
    var arrayNivelGestion: any[] = [...new Set(data.map(e => e[position].toString()))];
    console.log(arrayNivelGestion)
    return arrayNivelGestion;

  }

  selectedYear: any;
  selectedCompany: any;

  filterByYearAndCompany() {
    console.log(this.selectedYear, this.selectedCompany);

    if ((this.selectedYear === null && this.selectedCompany === null)
      || (this.selectedYear === undefined && this.selectedCompany === undefined)
      || (this.selectedYear === '' && this.selectedCompany === '')) {
      this.tableBody = this.dataTableSeries;

    } else {
      this.tableBody = this.dataTableSeries.filter((serie: any) => {
        return ((this.selectedYear === undefined || this.selectedYear === '') ? true : serie[1].toString() === this.selectedYear) &&
          ((this.selectedCompany === undefined || this.selectedCompany === '') ? true : serie[0].toString() === this.selectedCompany);
      });

      console.log(this.tableBody);
    }

  }
  selectedCompany2: any;
  filterByYearAndCompany2() {

    console.log(this.selectedYear, this.selectedCompany);

    if ((this.selectedYear === null && this.selectedCompany === null)
      || (this.selectedYear === undefined && this.selectedCompany === undefined)
      || (this.selectedYear === '' && this.selectedCompany === '')) {
      this.tableBody = this.dataTableSeries;

    } else {
      this.tableBody = this.dataTableSeries.filter((serie: any) => {
        return ((this.selectedYear === undefined || this.selectedYear === '') ? true : serie[0].toString() === this.selectedYear) &&
          ((this.selectedCompany === undefined || this.selectedCompany === '') ? true : serie[1].toString() === this.selectedCompany);
      });
      console.log(this.tableBody);

    }

  }
  selectedAcuerdo: any;
  selectedFechaFirma: any;
  filterByAcuerdoFechaFirma() {

    console.log(this.selectedAcuerdo, this.selectedFechaFirma);
    if ((this.selectedAcuerdo === null && this.selectedFechaFirma === null) ||
      (this.selectedAcuerdo === undefined && this.selectedFechaFirma === undefined)
      || (this.selectedAcuerdo === '' && this.selectedFechaFirma === '')) {
      this.tableBody = this.dataTableSeries;

    } else {
      this.tableBody = this.dataTableSeries.filter((serie: any) => {
        return ((this.selectedAcuerdo === undefined || this.selectedAcuerdo === '') ? true : serie[3].toString() === this.selectedAcuerdo) &&
          ((this.selectedFechaFirma === undefined || this.selectedFechaFirma === '') ? true : serie[1].toString() === this.selectedFechaFirma);
      });
      console.log(this.tableBody);
    }

  }
  selectedYear2: any;
  selectedNombreClase: any;
  selectedDataGei: any;
  filterByfourLabels() {
    console.log(this.selectedYear2, this.selectedCompany2, this.selectedNombreClase, this.selectedDataGei);
    if ((this.selectedYear2 === null && this.selectedCompany2 === null && this.selectedNombreClase === null && this.selectedDataGei === null)
      || (this.selectedYear2 === undefined && this.selectedCompany2 === undefined && this.selectedNombreClase === undefined && this.selectedDataGei === undefined)
      || (this.selectedYear2 === '' && this.selectedCompany2 === '' && this.selectedNombreClase === '' && this.selectedDataGei === '')) {
      this.tableBody = this.dataTableSeries;
      console.log(this.tableBody);
      console.log('entro al if');

    } else {
      this.tableBody = this.dataTableSeries.filter((serie: any) => {
        return ((this.selectedYear2 === undefined || this.selectedYear2 === '') ? true : serie[0].toString() === this.selectedYear2) &&
          ((this.selectedCompany2 === undefined || this.selectedCompany2 === '') ? true : serie[1].toString() === this.selectedCompany2) &&
          ((this.selectedNombreClase === undefined || this.selectedNombreClase === '') ? true : serie[7].toString() === this.selectedNombreClase) &&
          ((this.selectedDataGei === undefined || this.selectedDataGei === '') ? true : serie[8].toString() === this.selectedDataGei);


      });

      console.log(this.tableBody);
      console.log('entro al else');

    }

  }


  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }


}
