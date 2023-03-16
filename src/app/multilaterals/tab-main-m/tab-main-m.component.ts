import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SendCodeService } from '../services/tab/send-code.service';
import { KEY_PARAM_ML } from '../../national/tab-main-n/config/config';

@Component({
  selector: 'app-tab-main-m',
  templateUrl: './tab-main-m.component.html',
  styleUrls: ['./tab-main-m.component.css']
})
export class TabMainMComponent implements OnInit {

  onChangeIndicadorSub: Subscription;
  private urlBaseSummary: string = '/indicador-multilateral/resumen/';
  private urlBasePositioning: string = '/indicador-multilateral/posicionamiento/';
  private urlBaseComparative: string = '/indicador-multilateral/comparativo/';
  private urlBaseComparisonByMeasures: string = '/indicador-multilateral/comparacion-medidas/';
  private urlBaseWorldComparison: string = '/indicador-multilateral/comparativa-mundial/';
  private urlBasePatents: string = '/indicador-multilateral/patentes/';
  private urlBaseMarineTransport: string = '/indicador-multilateral/transporte-maritimo/';
  private urlBaseRailways: string = '/indicador-multilateral/ferrocarriles/';
  private urlBaseAirTransport: string = '/indicador-multilateral/transporte-aereo/';
  codes: any;
  nameIndicator?: string;
  summary: string = "";
  positioning: string = "";
  comparative: string = "";
  comparisonByMeasures: string = "";
  worldComparison: string = "";
  patents: string = "";
  marineTransport: string = "";
  railways: string = "";
  airTransport: string = "";
  constructor(
    private sendCodeService: SendCodeService
  ) {
    this.onChangeIndicadorSub = this.sendCodeService.onChangeIndicador$.subscribe($event => {
      this.getRouterParam();//$event.
    });
  }

  ngOnInit(): void {
    this.getRouterParam();
  }

  getRouterParam() {
    let local: any = localStorage.getItem(KEY_PARAM_ML);
    if (local != null) {
      let code: any = JSON.parse(local);
      this.codes = code.graphic;
      this.summary = this.urlBaseSummary + code.graphic;
      this.positioning = this.urlBasePositioning + code.graphic;
      this.comparative = this.urlBaseComparative + code.graphic;
      this.comparisonByMeasures = this.urlBaseComparisonByMeasures + code.graphic;
      this.worldComparison = this.urlBaseWorldComparison + code.graphic;
      this.patents = this.urlBasePatents + code.graphic;
      this.marineTransport = this.urlBaseMarineTransport + code.graphic;
      this.railways = this.urlBaseRailways + code.graphic;
      this.airTransport = this.urlBaseAirTransport + code.graphic;
    }
  }

}