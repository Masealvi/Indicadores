import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirTransportComponent } from './tab-main-m/airTransport/air-transport.component';
import { ComparativeComponent } from './tab-main-m/comparative/comparative.component';
import { ComparisonByMeasuresComponent } from './tab-main-m/comparisonByMeasures/comparison-by-measures.component';
import { MarineTransportComponent } from './tab-main-m/marineTransport/marine-transport.component';
import { PatentsComponent } from './tab-main-m/patents/patents.component';
import { PositioningComponent } from './tab-main-m/positioning/positioning.component';
import { RailwaysComponent } from './tab-main-m/railways/railways.component';
import { SummaryComponent } from './tab-main-m/summary/summary.component';
import { TabMainMComponent } from './tab-main-m/tab-main-m.component';
import { WorldComparisonComponent } from './tab-main-m/worldComparison/world-comparison.component';

const routes: Routes = [
  {
    path: '', component: TabMainMComponent,
    children: [
      { path: 'resumen/:codigo', component: SummaryComponent },
      { path: 'posicionamiento/:codigo', component: PositioningComponent },
      { path: 'comparativo/:codigo', component: ComparativeComponent },
      { path: 'comparativa-mundial/:codigo', component: WorldComparisonComponent },
      { path: 'comparacion-medidas/:codigo', component: ComparisonByMeasuresComponent },
      { path: 'patentes/:codigo', component: PatentsComponent },
      { path: 'transporte-maritimo/:codigo', component: MarineTransportComponent },
      { path: 'ferrocarriles/:codigo', component: RailwaysComponent },
      { path: 'transporte-aereo/:codigo', component: AirTransportComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultilateralsRoutingModule { }
